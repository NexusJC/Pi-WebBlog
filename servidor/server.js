const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");

const app = express();
const PORT = 3001;

// Configuración CORS más completa


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
    abortOnLimit: true,
    createParentPath: true // Crea directorios automáticamente
}));
app.use(cors({
    origin: 'http://localhost:3000', // Asegúrate que coincida con tu puerto frontend
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Conexión mejorada a la base de datos usando pool
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_blog",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verificar conexión a la base de datos
pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Error al conectar a la base de datos:", err);
        process.exit(1);
    }
    console.log("✅ Conectado a la base de datos MySQL");
    connection.release();
});

// Ruta de prueba mejorada
app.get("/", (req, res) => {
    res.json({ 
        status: "running",
        message: "Servidor API funcionando",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        endpoints: {
            register: "/registrar",
            createPost: "/api/posts"  // ← Cambiado de "/post" a "/api/posts"
        }
    });
});

// Ruta para registrar usuario (mejorada)
app.post("/registrar", async (req, res) => {
    const { userName, userEmail, userPassword } = req.body;

    // Validación mejorada
    if (!userName?.trim() || !userEmail?.trim() || !userPassword?.trim()) {
        return res.status(400).json({ 
            success: false, 
            message: "Todos los campos son requeridos",
            required: {
                userName: "string",
                userEmail: "string (email válido)",
                userPassword: "string (mínimo 6 caracteres)"
            }
        });
    }

    try {
        // Verificar si el email ya existe
        const [existingUser] = await pool.promise().query(
            "SELECT id FROM users WHERE email = ? LIMIT 1", 
            [userEmail]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({ 
                success: false, 
                message: "El correo electrónico ya está registrado",
                suggestion: "¿Olvidaste tu contraseña?"
            });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(userPassword, 12);
        
        // Insertar nuevo usuario
        const [result] = await pool.promise().query(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            [userName.trim(), userEmail.trim(), hashedPassword, "usuario"]
        );

        res.status(201).json({
            success: true,
            message: "Usuario registrado exitosamente",
            data: {
                userId: result.insertId,
                userName,
                userEmail,
                role: "usuario"
            }
        });

    } catch (error) {
        console.error("Error en /registrar:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error en el servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
});

// Asegúrate de tener ESTO en tu server.js (después de los middlewares y antes de los manejadores de error)
app.post('/api/posts', async (req, res) => {
    try {
        const { user_id, content } = req.body;
        const mensaje_autor = req.body.mensaje_autor;
        
        if (!user_id || !content || !mensaje_autor) {
            return res.status(400).json({ error: 'Datos incompletos' });
        }

        let image_path = null;
        if (req.files?.image) {
            const image = req.files.image;
            const ext = path.extname(image.name);
            const filename = `post_${Date.now()}${ext}`;
            const uploadPath = path.join(__dirname, 'uploads', filename);
            
            await image.mv(uploadPath);
            image_path = `/uploads/${filename}`;
        }

        const [result] = await pool.query(
            `INSERT INTO posts (user_id, content, mensaje_autor, image_path) 
             VALUES (?, ?, ?, ?)`,
            [user_id, content, mensaje_autor, image_path]
        );

        res.json({
            success: true,
            postId: result.insertId,
            imagePath: image_path
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al crear el post' });
    }
});
app.get('/api/posts', async (req, res) => {
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
                imageUrl: post.image_path ? `http://localhost:3001/uploads/${post.image_path.split('/').pop()}` : null
            }))
        });
    } catch (error) {
        console.error('Error al obtener posts:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al obtener los posts'
        });
    }
});
// ... (el resto de tu código se mantiene igual, incluyendo los handlers de errores y cierre)
  
  // Ruta para obtener todos los posts
 // Ruta para registrar usuario (asegúrate que coincida exactamente con lo que llamas)

// Manejo de errores global mejorado
app.use((err, req, res, next) => {
    console.error("🔥 Error global no manejado:", err);
    
    res.status(500).json({ 
        success: false, 
        message: "Error interno del servidor",
        error: process.env.NODE_ENV === 'development' ? {
            name: err.name,
            message: err.message,
            stack: err.stack
        } : null
    });
});

// Iniciar el servidor con manejo de errores
const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📂 Ruta de uploads: ${path.join(__dirname, "uploads")}`);
    console.log(`🕒 Iniciado en: ${new Date().toLocaleString()}`);
});

// Manejo de cierre adecuado
process.on('SIGTERM', () => {
    console.log('🛑 Recibido SIGTERM. Cerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        pool.end();
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('🛑 Recibido SIGINT. Cerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        pool.end();
        process.exit(0);
    });
});

process.on('unhandledRejection', (err) => {
    console.error('⚠️ Unhandled Rejection:', err);
    // Puedes agregar aquí notificaciones o logs adicionales
});
