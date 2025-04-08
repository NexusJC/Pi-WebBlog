const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
    createParentPath: true
}));

// Archivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/posts", express.static(path.join(__dirname, "frontend", "posts")));

// Conexión a base de datos
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_blog",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Error al conectar a la base de datos:", err);
        process.exit(1);
    }
    console.log("✅ Conectado a la base de datos");
    connection.release();
});

// 🔹 Ruta de estado
app.get("/", (req, res) => {
    res.json({ 
        status: "running",
        message: "API del blog activa",
        timestamp: new Date().toISOString()
    });
});

// 🔹 Registro de usuario
app.post("/registrar", async (req, res) => {
    const { userName, userEmail, userPassword } = req.body;
    if (!userName || !userEmail || !userPassword) {
        return res.status(400).json({ success: false, message: "Faltan datos" });
    }

    try {
        const [exists] = await pool.promise().query("SELECT id FROM users WHERE email = ?", [userEmail]);
        if (exists.length > 0) return res.status(409).json({ success: false, message: "Correo ya registrado" });

        const hashed = await bcrypt.hash(userPassword, 10);
        const [result] = await pool.promise().query(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            [userName, userEmail, hashed, "usuario"]
        );
        res.status(201).json({ success: true, userId: result.insertId, userName });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error al registrar usuario" });
    }
});

// 🔹 Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Faltan datos" });

    try {
        const [users] = await pool.promise().query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) return res.status(404).json({ success: false, message: "Correo no registrado" });

        const user = users[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ success: false, message: "Contraseña incorrecta" });

        res.json({ success: true, name: user.name, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error en login" });
    }
});

// 🔹 Recuperar contraseña (verificación de correo)
app.post("/recuperar", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Correo requerido" });

    try {
        const [users] = await pool.promise().query("SELECT id FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: "Correo no encontrado" });
        }
        res.json({ success: true, message: "Correo verificado" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error interno" });
    }
});

// 🔹 Restablecer contraseña
app.post("/restablecer-contrasena", async (req, res) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ success: false, message: "Datos incompletos" });

    try {
        const hashed = await bcrypt.hash(newPassword, 10);
        await pool.promise().query("UPDATE users SET password = ? WHERE email = ?", [hashed, email]);
        res.json({ success: true, message: "Contraseña actualizada" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error al actualizar contraseña" });
    }
});

// 🔹 Crear nuevo post
app.post("/api/posts", async (req, res) => {
    try {
        const { user_id, content, title, mensaje_autor, tags } = req.body;
        if (!user_id || !content || !title || !mensaje_autor || !tags) {
            return res.status(400).json({ success: false, message: "Faltan datos para crear post" });
        }

        let image_path = null;
        if (req.files?.image) {
            const ext = path.extname(req.files.image.name);
            const filename = `post_${Date.now()}${ext}`;
            const uploadPath = path.join(__dirname, "uploads", filename);
            await req.files.image.mv(uploadPath);
            image_path = `/uploads/${filename}`;
        }

        const [result] = await pool.promise().query(
            "INSERT INTO posts (user_id, title, content, mensaje_autor, image_path, etiquetas) VALUES (?, ?, ?, ?, ?, ?)",
            [user_id, title, content, mensaje_autor, image_path, tags]
        );

        const htmlPath = path.join(__dirname, "frontend", "posts", `blog${result.insertId}.html`);
        const postHTML = `<!DOCTYPE html><html lang="es"><head><title>${title}</title></head><body><h1>${title}</h1><p>${content}</p></body></html>`;
        await writeFile(htmlPath, postHTML);

        res.json({ success: true, postId: result.insertId, htmlFile: `blog${result.insertId}.html` });
    } catch (err) {
        console.error("❌ Error al crear post:", err);
        res.status(500).json({ success: false, message: "Error al crear post" });
    }
});

// 🔹 Obtener todos los posts
app.get("/api/posts", async (req, res) => {
    try {
        const [posts] = await pool.promise().query(`
            SELECT p.*, u.name as author_name 
            FROM posts p
            LEFT JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
        `);

        res.json({
            success: true,
            posts: posts.map(post => ({
                ...post,
                imageUrl: post.image_path ? `http://localhost:${PORT}${post.image_path}` : null
            }))
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error al obtener posts" });
    }
});

// 🔹 Error global
app.use((err, req, res, next) => {
    console.error("🔥 Error global:", err);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
});

// 🔹 Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
