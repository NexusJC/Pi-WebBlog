const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);
const sanitizeHtml = require("sanitize-html");


const app = express();
const PORT = process.env.PORT || 3001;


// Middleware
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
    createParentPath: true
}));

// Archivos estáticos

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/admin",
  express.static(path.join(__dirname, "frontend", "panel-de-administracion"))
);
app.use("/posts", express.static(path.join(__dirname, "frontend", "posts")));
app.use("/img", express.static(path.join(__dirname, "frontend", "img")));
app.use("/css", express.static(path.join(__dirname, "frontend", "css")));
app.use("/js", express.static(path.join(__dirname, "frontend", "js")));
app.use("/menu", express.static(path.join(__dirname, "frontend", "menu")));
app.use("/about-us", express.static(path.join(__dirname, "frontend", "about-us")));
app.use("/contact", express.static(path.join(__dirname, "frontend", "contact")));
app.use("/login", express.static(path.join(__dirname, "frontend", "login")));
// Rutas de secciones/páginas
app.use("/menu", express.static(path.join(__dirname, "frontend", "menu")));
app.use("/about-us", express.static(path.join(__dirname, "frontend", "about-us")));
app.use("/contact", express.static(path.join(__dirname, "frontend", "contact")));
app.use("/login", express.static(path.join(__dirname, "frontend", "login")));
app.use("/posts", express.static(path.join(__dirname, "frontend", "posts")));
app.use("/publicaciones", express.static(path.join(__dirname, "frontend", "publicaciones")));

// Conexión a base de datos
require('dotenv').config(); // Ya está en tu código, bien

const pool = mysql.createPool({
    uri: process.env.MYSQL_URL,
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

  // Validaciones del backend
  const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  const passwordRegex = /^.{4,16}$/;
  const userNameRegex = /^[a-zA-Z0-9_-]{4,16}$/;

  if (!userName || !userEmail || !userPassword) {
    return res.status(400).json({ success: false, message: "Faltan datos" });
  }

  if (!userNameRegex.test(userName)) {
    return res.status(400).json({ success: false, message: "Nombre de usuario inválido" });
  }

  if (!emailRegex.test(userEmail)) {
    return res.status(400).json({ success: false, message: "Correo inválido" });
  }

  if (!passwordRegex.test(userPassword)) {
    return res.status(400).json({ success: false, message: "Contraseña inválida" });
  }

  try {
    const [exists] = await pool.promise().query("SELECT id FROM users WHERE email = ?", [userEmail]);
    if (exists.length > 0) {
      return res.status(409).json({ success: false, message: "Correo ya registrado" });
    }

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

        res.json({ success: true, userId: user.id, name: user.name, role: user.role });
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

app.post('/like/:id', async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  console.log("🧪 POST /like", { postId, userId });

  if (!userId) {
    return res.status(400).json({ error: "Falta userId" });
  }

  try {
    // Simplemente incrementamos el contador
    await pool.promise().query(
      "UPDATE posts SET likes = likes + 1 WHERE id = ?",
      [postId]
    );

    const [[{ likes }]] = await pool.promise().query(
      "SELECT likes FROM posts WHERE id = ?",
      [postId]
    );

    res.json({ likes });
  } catch (err) {
    console.error("❌ Error al dar like:", err.message, err.stack);
    res.status(500).json({ error: "Error al dar like" });
  }
});

// app.getnar un like (decrementar contador)
app.delete("/api/comments/:id", async (req, res) => {
  const commentId = req.params.id;
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ success: false, message: "Falta userId" });

  try {
    const [rows] = await pool.promise().query("SELECT * FROM comments WHERE id = ?", [commentId]);
    if (!rows.length) return res.status(404).json({ success: false, message: "Comentario no encontrado" });

    const comment = rows[0];
    if (comment.user_id != userId) {
      return res.status(403).json({ success: false, message: "No autorizado" });
    }

    await pool.promise().query("DELETE FROM comments WHERE id = ?", [commentId]);
    res.json({ success: true, message: "Comentario eliminado" });
  } catch (err) {
    console.error("❌ Error al eliminar comentario:", err);
    res.status(500).json({ success: false, message: "Error interno" });
  }
});
app.put("/api/comments/:id", async (req, res) => {
  const commentId = req.params.id;
  const { content, userId } = req.body;

  if (!content || !userId) return res.status(400).json({ success: false, message: "Faltan datos" });

  try {
    const [rows] = await pool.promise().query("SELECT * FROM comments WHERE id = ?", [commentId]);
    if (!rows.length) return res.status(404).json({ success: false, message: "Comentario no encontrado" });

    const comment = rows[0];
    if (comment.user_id != userId) {
      return res.status(403).json({ success: false, message: "No autorizado" });
    }

    await pool.promise().query("UPDATE comments SET content = ? WHERE id = ?", [content, commentId]);
    res.json({ success: true, message: "Comentario actualizado" });
  } catch (err) {
    console.error("❌ Error al editar comentario:", err);
    res.status(500).json({ success: false, message: "Error interno" });
  }
});

// Obtener número de likes de un post
app.get("/api/posts/:id/likes", async (req, res) => {
  const postId = req.params.id;

  try {
    const [[{ likes }]] = await pool.promise().query(
      "SELECT likes FROM posts WHERE id = ?",
      [postId]
    );

    res.json({ likes });
  } catch (err) {
    console.error("❌ Error al obtener likes:", err.message, err.stack);
    res.status(500).json({ error: "Error al obtener likes" });
  }
});




  

// 🔹 Crear nuevo post
app.post('/api/posts', async (req, res) => {
    try {
        const { user_id, content, title, tags, mensaje_autor } = req.body;
        // Limpia el HTML, pero permite <a> con href seguro
        let rawReferencias = req.body.referencias || "";
// Detectar links en texto y envolverlos con <a>
        rawReferencias = rawReferencias.replace(
        /(https?:\/\/[^\s]+)/g,
        (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
        );

        const referencias = sanitizeHtml(rawReferencias, {
            allowedTags: ['a', 'p', 'br', 'ul', 'li', 'strong', 'em'],
            allowedAttributes: {
                'a': ['href', 'target', 'rel']
            },
            allowedSchemes: ['http', 'https']
        });
        

        if (!user_id || !title || !content || !mensaje_autor || !tags) {
            return res.status(400).json({ error: 'Datos incompletos' });
        }

        let parsedTags = [];
        try {
            parsedTags = JSON.parse(tags);
        } catch (e) {
            console.warn("⚠️ Etiquetas mal formateadas:", tags);
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


        const query = `
            INSERT INTO posts 
            (user_id, content, mensaje_autor, image_path, created_at, title, etiquetas, referencias)
            VALUES (?, ?, ?, ?, NOW(), ?, ?, ?)
        `;
        const formattedTags = JSON.stringify(parsedTags.map(tag => ({ value: tag })));
const [result] = await pool.promise().execute(query, [user_id, content, mensaje_autor, image_path, title, formattedTags, referencias]);


        const postId = result.insertId;
        const postFilename = `blog${postId}.html`;
       const imageSrc = image_path ? image_path : '/img/default.jpg';

        const postHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="/posts/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <script src="https://kit.fontawesome.com/e718b2ee5a.js" crossorigin="anonymous"></script>
</head>

<body>
    <header class="header">
        <div class="header-content">
            <div class="menu">
                <nav class="main-navbar">
                    <ul>
                        <li>
                            <div class="header-content__logo-container">
                                <img src="/img/logo-ecolima.png" alt="">
                            </div>
                        </li>
                        <li title="Menú Principal"><a href="/menu/index.html"><i class="fa-solid fa-house"></i></a></li>
                        <li title="Blog" class="blog-selected"><a class="blog-selected" href="#"><i class="fa-solid fa-newspaper"></i></a></li>
                        <li title="¿Quiénes somos?"><a href="/about-us/aboutUs.html"><i class="fa-solid fa-people-group"></i></a></li>
                        <li title="¡Contáctanos!"><a href="/contact/contact.html"><i class="fa-solid fa-envelope"></i></a></li>
                        <li title="Usuario" id="userMenuItem">
                          <li><button class="user-button" id="userDisplay"><i class="fa-solid fa-user"></i> Iniciar sesión</button></li>
                        </li>
                        <li title="Búsquedas">
                            <div class="main-navbar--ctn-icon-search">
                                <i class="fa-solid fa-magnifying-glass" id="icon-search"></i>
                            </div>
                        </li>
                    </ul>
                </nav>  
            </div>
            <div id="icon-menu">
                <i class="fa-solid fa-bars"></i>
            </div>
        </div>
    </header>

    <div id="ctn-bars-search">
        <input type="text" id="inputSearch" placeholder="¿Qué deseas buscar?">
    </div>

    <ul id="box-search">
        <li><a href="../../blog1/blog1.html"><i class="fa-solid fa-magnifying-glass"></i>Ecosistemas terrestres</a></li>
        <li><a href="../../blog2/blog2.html"><i class="fa-solid fa-magnifying-glass"></i>Los campos</a></li>
        <li><a href="../../blog3/blog3.html"><i class="fa-solid fa-magnifying-glass"></i>Ecosistemas en lagos</a></li>
        <li><a href="../../blog4/blog4.html"><i class="fa-solid fa-magnifying-glass"></i>Habitats de animales</a></li>
        <li><a href="#b5"><i class="fa-solid fa-magnifying-glass"></i>Blog 5</a></li>
        <li><a href="#b6"><i class="fa-solid fa-magnifying-glass"></i>Blog 6</a></li>
    </ul>

    <div id="cover-ctn-search"></div>

    <div class="main-wrapper">
        <aside class="main-wrapper__secondary-navbar">
            <div class="secondary-navbar--contenedor post" data-id="${postId}">
                <h2><br>Información</h2>
                <h3>Fecha</h3>
                <p>${new Date().toLocaleDateString()}</p>
                
                <h3>Tema</h3>
                <p>${title}</p>
                <h3>Etiquetas</h3>
                <ul>
                ${parsedTags.map(tag => `<li>${tag}</li>`).join("")}
                </ul>
                <h3>Mensaje</h3>
                <p>${mensaje_autor}</p>
                <button class="like-button">
                ❤️ <span class="like-count">0</span>
                </button>
            </div>
        </aside>
        <!-- Sección de Comentarios -->

        <main>
<div id="likeModal" class="modal">
  <div class="modal-content">
    <h3>🔒 Acción restringida</h3>
    <p>Debes iniciar sesión para dar like a una publicación.</p>
    <div class="modal-buttons">
      <button id="goToLoginLike">Iniciar sesión</button>
      <button id="stayGuestLike">Permanecer como invitado</button>
    </div>
  </div>
</div>



            <div class="main-wrapper__content blog-1">
                <article>
                    <h2 id="b1">${title}</h2>
                    <img src="${imageSrc}" alt="Imagen del post" class="post-image">
                    <div>${content}</div>
                </article>
                <section class="referencias">
                    <h3>Referencias</h3>
                    <div>${ referencias || 'Ninguna referencia proporcionada.'}</div>
                </section>


            </div>
            <!-- Sección de Comentarios -->
<div class="comments-section">
  <h2>Comentarios</h2>
<div class="new-comment">
  <div class="avatar" id="avatarInicial"></div>
  <textarea id="commentInput" placeholder="Escribe tu comentario..."></textarea>
  <button id="sendComment">Enviar</button>
</div>


  <div id="commentsList"></div>
  <button id="verMasBtn" style="display: none;">Ver más</button>
</div>
        </main>
        <aside class="main-wrapper__contenido-relacionado">
            <h2>Contenido relacionado</h2>
            <div class="related-items-container" id="related-posts-container">
                <!-- Los posts se insertarán aquí dinámicamente -->
            </div>
        </aside>

    </div>

        <footer class="footer">
        <div class="footer-content">
            <div class="footer__grupo1">
                <div class="box">
                    <figure>
                        <a href="#">
                            <img src="/img/logo-ecolima.png" alt="">
                        </a>
                    </figure>
                </div>
                <div class="box">
                    <h2>¡Gracias por visitar!</h2>
                    <p>Conservemos juntos los ecosistemas para un futuro más verde y saludable.</p>
                </div>
                <div class="box">
                    <h2>Síguenos</h2>
                    <div class="red-social">
                         <a target="_blank" href="https://www.facebook.com/people/Ecolima/61575066085514/" class="fa fa-facebook"></a>
                    <a target="_blank" href="https://www.instagram.com/accounts/login/" class="fa fa-instagram"></a>
                    <a target="_blank" href="https://x.com/EEcolima94463" class="fa fa-twitter"></a>
                    <a target="_blank" href="https://www.youtube.com/channel/UC2W95ydAwJjhvyZnvhPnC4A" class="fa fa-youtube"></a>
                    </div>
                </div>
            </div>
            <div class="footer__grupo2">
                <small>© 2025 <b>Ecolima</b> - Todos los Derechos Reservados</small>
            </div>
        </div>
    </footer>
        <!-- Modal para iniciar sesión -->
<div id="commentModal" class="modal"> <!-- CAMBIADO -->
  <div class="modal-content">
    <h3>¡Atención!</h3>
    <p>Para comentar, es recomendable que inicies sesión. Así tu comentario aparecerá con tu nombre.</p>
    <div class="modal-buttons">
      <button id="btnLogin">Iniciar sesión</button>
      <button id="btnContinue">Continuar como visitante</button>
    </div>
  </div>
</div>

    <script src="/posts/scriptPosts.js"></script>
        <script>
  document.addEventListener("DOMContentLoaded", () => {
    const userName = localStorage.getItem("userName");
    const userId = localStorage.getItem("userId");
    const userDisplay = document.getElementById("userDisplay");

    if (userDisplay && userName && userId) {
      userDisplay.innerHTML = '<i class="fa-solid fa-user"></i> ' + userName;
    }
  });
</script>


</body>
</html>`;

        const savePath = path.join(__dirname, 'frontend', 'posts', postFilename);
        console.log("📝 Guardando archivo en:", savePath);

        await writeFile(savePath, postHTML);
        console.log("✅ Archivo HTML creado correctamente");

        return res.json({ // <- ESTE return evita errores dobles
            success: true,
            postId,
            htmlFile: postFilename,
            imagePath: image_path
        });

    } catch (error) {
        console.error('❌ Error al crear el post:', error);
        res.status(500).json({ error: 'Error interno al crear el post' });
    }
});


// 🔹 Quitar un like
app.delete("/like/:id", async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Falta userId" });
  }

  try {
    // Resta un like (sin permitir negativos)
    await pool.promise().query(
      "UPDATE posts SET likes = GREATEST(likes - 1, 0) WHERE id = ?",
      [postId]
    );

    const [[{ likes }]] = await pool.promise().query(
      "SELECT likes FROM posts WHERE id = ?",
      [postId]
    );

    res.json({ likes });
  } catch (err) {
    console.error("❌ Error al quitar like:", err.message);
    res.status(500).json({ error: "Error al quitar like" });
  }
});


// 🔹 Obtener todos los posts
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
                imageUrl: post.image_path ? `${req.protocol}://${req.get("host")}${post.image_path}` : '/img/default.jpg'
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

// 🔹 Obtener un post por ID
app.get('/api/posts/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    const [rows] = await pool.promise().query("SELECT * FROM posts WHERE id = ?", [postId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Post no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error al obtener post:", error);
    res.status(500).json({ success: false, message: "Error interno al cargar el post" });
  }
});
// 🔹 Eliminar un post por ID
app.delete('/api/posts/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    // Verifica si el post existe
    const [rows] = await pool.promise().query("SELECT * FROM posts WHERE id = ?", [postId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Post no encontrado" });
    }

    // Elimina el post de la base de datos
    await pool.promise().query("DELETE FROM posts WHERE id = ?", [postId]);

    // Elimina el archivo HTML asociado (ej. blog123.html)
    const htmlPath = path.join(__dirname, 'frontend', 'posts', `blog${postId}.html`);
    if (fs.existsSync(htmlPath)) {
      fs.unlinkSync(htmlPath);
    }

    res.json({ success: true, message: "Post eliminado" });
  } catch (err) {
    console.error("❌ Error al eliminar post:", err);
    res.status(500).json({ success: false, message: "Error interno" });
  }
});


app.put('/api/posts/:id', async (req, res) => {
    const fields = req.body;
const files = req.files || {};
   const postId = req.params.id;
const { title, content, referencias, mensaje_autor, tags } = fields;


  if (!title || !content || !mensaje_autor || !tags) {
    return res.status(400).json({ success: false, message: "Datos incompletos" });
  }

  try {
    // Procesar etiquetas
    const parsedTags = JSON.parse(tags);
    const formattedTags = JSON.stringify(parsedTags.map(tag => ({ value: tag })));
    const tagsText = parsedTags.map(tag => tag.value).join(", ");

    // Procesar referencias con sanitización
    let refProcesadas = (referencias || "").replace(
      /(https?:\/\/[^\s]+)/g,
      (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    );
    const safeReferencias = sanitizeHtml(refProcesadas, {
      allowedTags: ['a', 'p', 'br', 'ul', 'li', 'strong', 'em'],
      allowedAttributes: { 'a': ['href', 'target', 'rel'] },
      allowedSchemes: ['http', 'https']
    });

    // Verificar si viene nueva imagen
    let image_path = null;
    if (files?.image) {
      const image = files.image;
      const ext = path.extname(image.name);
      const filename = `post_${Date.now()}${ext}`;
      const uploadPath = path.join(__dirname, 'uploads', filename);
      await image.mv(uploadPath);
      image_path = `/uploads/${filename}`;
    }

    // Obtener el post actual (para conservar imagen previa si no se actualiza)
    const [currentData] = await pool.promise().query("SELECT * FROM posts WHERE id = ?", [postId]);
    if (!currentData.length) return res.status(404).json({ success: false, message: "Post no encontrado" });

    const oldPost = currentData[0];
    const newImagePath = image_path || oldPost.image_path;
    const user_id = oldPost.user_id;
    const likes = oldPost.likes;
    // Actualizar en BD
    await pool.promise().query(`
      UPDATE posts 
      SET title = ?, content = ?, mensaje_autor = ?, etiquetas = ?, referencias = ?, image_path = ? 
      WHERE id = ?
    `, [title, content, mensaje_autor, formattedTags, safeReferencias, newImagePath, postId]);

    // Generar el HTML actualizado
    const fecha = new Date().toLocaleDateString();
    const imageSrc = newImagePath ? newImagePath : '/img/default.jpg';

    const postHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="/posts/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <script src="https://kit.fontawesome.com/e718b2ee5a.js" crossorigin="anonymous"></script>
</head>
<body>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="/posts/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <script src="https://kit.fontawesome.com/e718b2ee5a.js" crossorigin="anonymous"></script>
</head>

<body>
    <header class="header">
        <div class="header-content">
            <div class="menu">
                <nav class="main-navbar">
                    <ul>
                        <li>
                            <div class="header-content__logo-container">
                                <img src="/img/logo-ecolima.png" alt="">
                            </div>
                        </li>
                        <li title="Menú Principal"><a href="/menu/index.html"><i class="fa-solid fa-house"></i></a></li>
                        <li title="Blog" class="blog-selected"><a class="blog-selected" href="#"><i class="fa-solid fa-newspaper"></i></a></li>
                        <li title="¿Quiénes somos?"><a href="/about-us/aboutUs.html"><i class="fa-solid fa-people-group"></i></a></li>
                        <li title="¡Contáctanos!"><a href="/contact/contact.html"><i class="fa-solid fa-envelope"></i></a></li>
                        <li title="Usuario" id="userMenuItem">
                          <li><button class="user-button" id="userDisplay"><i class="fa-solid fa-user"></i> Iniciar sesión</button></li>
                        </li>
                        <li title="Búsquedas">
                            <div class="main-navbar--ctn-icon-search">
                                <i class="fa-solid fa-magnifying-glass" id="icon-search"></i>
                            </div>
                        </li>
                    </ul>
                </nav>  
            </div>
            <div id="icon-menu">
                <i class="fa-solid fa-bars"></i>
            </div>
        </div>
    </header>

    <div id="ctn-bars-search">
        <input type="text" id="inputSearch" placeholder="¿Qué deseas buscar?">
    </div>

    <ul id="box-search">
        <li><a href="../../blog1/blog1.html"><i class="fa-solid fa-magnifying-glass"></i>Ecosistemas terrestres</a></li>
        <li><a href="../../blog2/blog2.html"><i class="fa-solid fa-magnifying-glass"></i>Los campos</a></li>
        <li><a href="../../blog3/blog3.html"><i class="fa-solid fa-magnifying-glass"></i>Ecosistemas en lagos</a></li>
        <li><a href="../../blog4/blog4.html"><i class="fa-solid fa-magnifying-glass"></i>Habitats de animales</a></li>
        <li><a href="#b5"><i class="fa-solid fa-magnifying-glass"></i>Blog 5</a></li>
        <li><a href="#b6"><i class="fa-solid fa-magnifying-glass"></i>Blog 6</a></li>
    </ul>

    <div id="cover-ctn-search"></div>

 <div class="main-wrapper">
        <aside class="main-wrapper__secondary-navbar">
            <div class="secondary-navbar--contenedor post" data-id="${postId}">
                <h2><br>Información</h2>
                <h3>Fecha</h3>
                <p>${new Date().toLocaleDateString()}</p>
                
                <h3>Tema</h3>
                <p>${title}</p>
                <h3>Etiquetas</h3>
                <ul>
                ${parsedTags.map(tag => `<li>${tag}</li>`).join("")}
                </ul>
                <h3>Mensaje</h3>
                <p>${mensaje_autor}</p>
                <button class="like-button">
                ❤️ <span class="like-count">0</span>
                </button>
            </div>
        </aside>
        <!-- Sección de Comentarios -->

        <main>
<div id="likeModal" class="modal">
  <div class="modal-content">
    <h3>🔒 Acción restringida</h3>
    <p>Debes iniciar sesión para dar like a una publicación.</p>
    <div class="modal-buttons">
      <button id="goToLoginLike">Iniciar sesión</button>
      <button id="stayGuestLike">Permanecer como invitado</button>
    </div>
  </div>
</div>



            <div class="main-wrapper__content blog-1">
                <article>
                    <h2 id="b1">${title}</h2>
                    <img src="${imageSrc}" alt="Imagen del post" class="post-image">
                    <div>${content}</div>
                </article>
                <section class="referencias">
                    <h3>Referencias</h3>
                    <div>${ referencias || 'Ninguna referencia proporcionada.'}</div>
                </section>


            </div>
            <!-- Sección de Comentarios -->
<div class="comments-section">
  <h2>Comentarios</h2>
  <div class="new-comment">
    <div class="avatar" id="avatarInicial"></div>
        <button id="sendComment">Enviar</button>
  </div>
  <div id="commentsList"></div>
  <button id="verMasBtn" style="display: none;">Ver más</button>
</div>
        </main>
        <aside class="main-wrapper__contenido-relacionado">
            <h2>Contenido relacionado</h2>
            <div class="related-items-container" id="related-posts-container">
                <!-- Los posts se insertarán aquí dinámicamente -->
            </div>
        </aside>

    </div>

    <footer class="footer">
        <div class="footer-content">
            <div class="footer__grupo1">
                <div class="box">
                    <figure>
                        <a href="#">
                            <img src="/img/logo-ecolima.png" alt="">
                        </a>
                    </figure>
                </div>
                <div class="box">
                    <h2>¡Gracias por visitar!</h2>
                    <p>Conservemos juntos los ecosistemas para un futuro más verde y saludable.</p>
                </div>
                <div class="box">
                    <h2>Síguenos</h2>
                    <div class="red-social">
                         <a target="_blank" href="https://www.facebook.com/people/Ecolima/61575066085514/" class="fa fa-facebook"></a>
                    <a target="_blank" href="https://www.instagram.com/accounts/login/" class="fa fa-instagram"></a>
                    <a target="_blank" href="https://x.com/EEcolima94463" class="fa fa-twitter"></a>
                    <a target="_blank" href="https://www.youtube.com/channel/UC2W95ydAwJjhvyZnvhPnC4A" class="fa fa-youtube"></a>
                    </div>
                </div>
            </div>
            <div class="footer__grupo2">
                <small>© 2025 <b>Ecolima</b> - Todos los Derechos Reservados</small>
            </div>
        </div>
    </footer>
  <!-- Modal para iniciar sesión -->
<div id="commentModal" class="modal"> <!-- CAMBIADO -->
  <div class="modal-content">
    <h3>¡Atención!</h3>
    <p>Para comentar, es recomendable que inicies sesión. Así tu comentario aparecerá con tu nombre.</p>
    <div class="modal-buttons">
      <button id="btnLogin">Iniciar sesión</button>
      <button id="btnContinue">Continuar como visitante</button>
    </div>
  </div>
</div>
  <script src="/posts/scriptPosts.js"></script>

</body>
</html>`;

    const filePath = path.join(__dirname, 'frontend', 'posts', `blog${postId}.html`);
    await fs.promises.writeFile(filePath, postHTML);

    res.json({ success: true, message: "Post actualizado y HTML regenerado correctamente" });

  } catch (error) {
    console.error("❌ Error al actualizar post:", error);
    res.status(500).json({ success: false, message: "Error interno al actualizar el post" });
  }
});


app.post("/api/comments", async (req, res) => {
const { postId, userId, content } = req.body;

if (!postId || !content || !userId) {
  return res.status(400).json({ success: false, message: "Debes estar registrado para comentar" });
}


  try {
    await pool.promise().query(
      "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)",
      [postId, userId || null, content]
    );
    res.json({ success: true, message: "Comentario guardado" });
  } catch (err) {
    console.error("❌ Error al guardar comentario:", err);
    res.status(500).json({ success: false, message: "Error interno" });
  }
});
app.get("/api/posts/:id/comments", async (req, res) => {
  const postId = req.params.id;

  try {
    const [rows] = await pool.promise().query(`
      SELECT c.*, u.name as user_name
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at DESC
    `, [postId]);

    res.json({ success: true, comments: rows });
  } catch (err) {
    console.error("❌ Error al obtener comentarios:", err);
    res.status(500).json({ success: false, message: "Error interno" });
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
