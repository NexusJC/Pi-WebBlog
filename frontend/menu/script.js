// BUSCADOR DE CONTENIDO
// Declarar elementos importantes del buscador
const bars_search = document.getElementById("ctn-bars-search");
const cover_ctn_search = document.getElementById("cover-ctn-search");
const inputSearch = document.getElementById("inputSearch");
const box_search = document.getElementById("box-search");
const API_BASE_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:3001"
  : "https://www.ecolima.blog";

// --- CÓDIGO DE TRADUCCIÓN ACOPLADO ---
const subscriptionKey = 'CixemvlfJzm2JRJ1QUHVDrdH8n7uclWJo0G6iZ0pbQC27MiNT2OvJQQJ99BFACLArgHXJ3w3AAAbACOGfCQ7';
const region = 'southcentralus';

let currentLang = 'es'; // Suponemos que la página empieza en español

// Objeto para almacenar los textos originales de la página.
// Esto nos permitirá restaurar el idioma original si se cambia de nuevo.
let originalTexts = new Map(); // Usamos Map para mejor manejo de referencias DOM

async function translatePageContent(targetLang) {
  const button = document.getElementById('translateBtn');
  // Selecciona los elementos que deseas traducir.
  // Puedes ajustar esta lista de selectores según tu HTML.
  const elementsToTranslate = document.querySelectorAll(
    'h1, h2, h3, p, span, li, a, button, .post h3, .post span, .post p, .post-card h3, .post-card span, .related-item h4'
    // Añade más selectores si hay otros elementos clave que necesiten traducción.
  );

  const textsToTranslate = Array.from(elementsToTranslate).map(el => {
    // Almacena el texto original antes de la traducción, solo si no ha sido guardado
    if (!originalTexts.has(el)) {
      originalTexts.set(el, el.innerText);
    }
    return { Text: el.innerText };
  });

  if (textsToTranslate.length === 0) {
    console.log("No hay elementos para traducir.");
    return;
  }

  try {
    const response = await fetch(`https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${targetLang}`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Ocp-Apim-Subscription-Region': region,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(textsToTranslate)
    });

    const data = await response.json();

    data.forEach((result, i) => {
      if (elementsToTranslate[i]) { // Asegurarse de que el elemento aún existe
        elementsToTranslate[i].innerText = result.translations[0].text;
      }
    });

    currentLang = targetLang;
    button.innerText = currentLang === 'es' ? 'Traducir al Inglés' : 'Traducir al Español';

  } catch (error) {
    console.error('Error al traducir la página:', error);
    alert('Hubo un problema al traducir el contenido.');
  }
}

// Función para restaurar el idioma original (si la página ya está traducida, al hacer clic de nuevo)
function restoreOriginalContent() {
  const button = document.getElementById('translateBtn');
  
  originalTexts.forEach((originalText, element) => {
    if (element) { // Asegurarse de que el elemento aún existe
      element.innerText = originalText;
    }
  });
  currentLang = 'es'; // Vuelve al idioma original
  button.innerText = 'Traducir al Inglés';
}

// Event listener para el botón de traducir (lo colocamos al inicio de los DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => {
  const translateButton = document.getElementById('translateBtn');
  if (translateButton) {
    translateButton.addEventListener('click', async () => {
      const targetLang = currentLang === 'es' ? 'en' : 'es';
      await translatePageContent(targetLang);
    });
  }
});
// --- FIN CÓDIGO DE TRADUCCIÓN ACOPLADO ---


// Eventos principales
// Delegación para detectar clics en el botón de búsqueda
document.addEventListener("click", (e) => {
  const target = e.target.closest("#icon-search");
  if (target) {
    e.preventDefault();
    mostrar_buscador();
  }
});
document.getElementById("cover-ctn-search").addEventListener("click", ocultar_buscador);
inputSearch.addEventListener("keyup", buscador_interno);

// Función que muestra el buscador
function mostrar_buscador() {
    bars_search.style.top = "5rem";
    cover_ctn_search.style.display = "block";
    inputSearch.focus();
    if (inputSearch.value === "") {
        box_search.style.display = "none";
    }
}

// Función que oculta el buscador
function ocultar_buscador() {
    bars_search.style.top = "-10rem";
    cover_ctn_search.style.display = "none";
    inputSearch.value = "";
    box_search.style.display = "none";
}

// Cargar todos los posts y añadir al buscador con contenido
async function cargarPostsEnBuscador() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/posts`);
        const data = await response.json();

        if (data.success) {
            box_search.innerHTML = ""; // Limpiar antes de cargar

            data.posts.forEach(post => {
                let tags = [];
try {
    if (Array.isArray(post.etiquetas)) {
        tags = post.etiquetas;
    } else if (typeof post.etiquetas === 'string') {
        // separa por coma si tiene varias etiquetas en un solo string
        tags = post.etiquetas.split(',').map(t => t.trim());
    }
} catch (e) {
    console.warn("❌ Etiqueta malformada:", post.etiquetas);
}

                agregarPostAlBuscador(post.id, post.title, post.content, tags);
            });
            // --- Llamada a la traducción después de cargar posts del buscador ---
            if (currentLang !== 'es') { // Solo si ya estamos en un idioma traducido
              await translatePageContent(currentLang);
            }
        }
    } catch (error) {
        console.error("❌ Error al cargar posts:", error);
    }
}

// Agrega un post al buscador
function agregarPostAlBuscador(postId, title, content = "", tags = []) {
    const tagList = Array.isArray(tags)
        ? tags.map(tag => typeof tag === 'string' ? tag.toLowerCase() : tag.value?.toLowerCase())
        : [];

    const contentTextOnly = content
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();

    const li = document.createElement("li");
    li.setAttribute("data-title", title.toLowerCase());
    li.setAttribute("data-content", contentTextOnly);
    li.setAttribute("data-tags", tagList.join(" "));

   li.innerHTML = `
    <a href="/posts/blog${postId}.html">
        <i class="fa-solid fa-magnifying-glass"></i> ${title}
    </a>
`;


    li.querySelector("a").addEventListener("click", ocultar_buscador);
    box_search.appendChild(li);
}


// Filtra resultados en vivo
function buscador_interno() {
    const filter = inputSearch.value.toLowerCase();
    const li = box_search.getElementsByTagName("li");

    let found = false;

    for (let i = 0; i < li.length; i++) {
        const title = li[i].getAttribute("data-title") || "";
        const content = li[i].getAttribute("data-content") || "";
        const tags = li[i].getAttribute("data-tags") || "";

        if (
            title.includes(filter) || 
            content.includes(filter) || 
            tags.includes(filter)
        ) {
            li[i].style.display = "";
            found = true;
        } else {
            li[i].style.display = "none";
        }
    }

    box_search.style.display = found ? "block" : "none";
}

// Iniciar carga automática de posts al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarPostsEnBuscador();
});

document.addEventListener('DOMContentLoaded', async () => {
    const containerLiked = document.getElementById('carousel-liked');
    try {
        const response = await fetch(`${API_BASE_URL}/api/posts`);
        const { success, posts } = await response.json();

        if (success) {
            const postsLikeados = [...posts]
                .sort((a, b) => b.likes - a.likes)
                .slice(0, 10);

            const likedHTML = postsLikeados.map(post => {
                let etiquetas = [];
                try {
                    const parsed = JSON.parse(post.etiquetas);
                    if (Array.isArray(parsed)) {
                        etiquetas = parsed.map(item => item.value);
                    }
                } catch (err) {
                    console.warn('⚠️ Etiquetas malformadas:', post.etiquetas);
                }

                return `
                    <div class="post">
                        <div class="ctn-img">
                            <img src="${post.imageUrl || '../img/default.jpg'}" alt="Post image">
                        </div>
                        <h3>${post.title || 'Sin título'}</h3>
                        <span>${new Date(post.created_at).toLocaleDateString()}</span>
                        <ul class="ctn-tags">
                            ${etiquetas.map(tag => `<li>${tag.trim()}</li>`).join('')}
                        </ul>
                        <p>❤️ ${post.likes || 0}</p>
                        <a href="/posts/blog${post.id}.html">
                            <button>Leer más</button>
                        </a>
                    </div>
                `;
            }).join('');

            containerLiked.innerHTML = likedHTML;
            // --- Llamada a la traducción después de cargar posts likeados ---
            if (currentLang !== 'es') {
              await translatePageContent(currentLang);
            }
        }
    } catch (err) {
        console.error("❌ Error cargando posts más likeados:", err);
    }
});


    function initCarrusel(selector, leftArrowClass, rightArrowClass, interval = 3500) {
    const container = document.querySelector(selector);
    if (!container) return;

    const postWidth = container.querySelector(".post")?.offsetWidth + 20 || 320;
    let scrollAmount = 0;

    function autoScroll() {
        scrollAmount += postWidth;
        if (scrollAmount >= container.scrollWidth - container.offsetWidth) {
            scrollAmount = 0;
        }
        container.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }

    setInterval(autoScroll, interval);

    const leftArrow = document.querySelector(leftArrowClass);
    const rightArrow = document.querySelector(rightArrowClass);

    if (leftArrow && rightArrow) {
        leftArrow.addEventListener("click", () => {
            scrollAmount -= postWidth;
            if (scrollAmount < 0) scrollAmount = 0;
            container.scrollTo({ left: scrollAmount, behavior: "smooth" });
        });

        rightArrow.addEventListener("click", () => {
            scrollAmount += postWidth;
            if (scrollAmount > container.scrollWidth - container.offsetWidth) {
                scrollAmount = container.scrollWidth - container.offsetWidth;
            }
            container.scrollTo({ left: scrollAmount, behavior: "smooth" });
        });
    }
}

// Inicializar ambos carruseles
document.addEventListener("DOMContentLoaded", () => {
    initCarrusel(".posts-liked", ".left-arrow-liked", ".right-arrow-liked");
    initCarrusel(".posts-recent", ".left-arrow-recent", ".right-arrow-recent");
});


    // Contenido relacionado (aside derecho)
    const relatedContainer = document.querySelector('.related-items-container');
    const relatedItems = relatedContainer ? relatedContainer.querySelectorAll('.related-item') : [];

    if (relatedContainer && relatedItems.length > 0) {
        let currentIndex = 0;

        function scrollToItem(index) {
            const itemHeight = relatedItems[0].offsetHeight + 10;
            relatedContainer.scrollTo({
                top: index * itemHeight,
                behavior: 'smooth',
            });
        }

        function autoScrollRelated() {
            currentIndex = (currentIndex + 1) % relatedItems.length;
            scrollToItem(currentIndex);
        }

        setInterval(autoScrollRelated, 6000);
    }


document.addEventListener("DOMContentLoaded", () => {
document.addEventListener("click", (e) => {
  const modal = document.getElementById("logoutModal");

  // Abrir el modal si se hace clic en el botón de cerrar sesión
  const abrirModalBtn = e.target.closest("#abrirLogoutModal");
  if (abrirModalBtn && modal) {
    e.preventDefault();
    modal.classList.add("show");
    return;
  }

  // Confirmar cierre de sesión
  if (e.target.id === "confirmLogout") {
    localStorage.clear();
    location.href = "/menu/index.html";
    return;
  }

  // Cancelar cierre de sesión
  if (e.target.id === "cancelLogout" || e.target === modal) {
    modal.classList.remove("show");
    return;
  }
});


  const modal = document.getElementById("logoutModal");
  const confirmBtn = document.getElementById("confirmLogout");
  const cancelBtn = document.getElementById("cancelLogout");

  // Ya tienes un listener en el document para abrir el modal,
  // así que este bloque es redundante si solo era para el clic inicial
  // if (abrirModalBtn && modal) {
  //   abrirModalBtn.addEventListener("click", (e) => {
  //     e.preventDefault();
  //     modal.classList.add("show");
  //   });
  // }

  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      localStorage.clear();
      location.href = "/login/login.html";
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      modal.classList.remove("show");
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
    }
  });
});






document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('carousel-posts');
    try {
        const response = await fetch(`${API_BASE_URL}/api/posts`);
        const { success, posts } = await response.json();

if (success) {
    console.log("🧪 Posts recibidos del servidor:", posts);

    // ========================
    // 🌀 Sección del Carrusel
    // ========================
    const carruselHTML = posts.slice(0, 10).map((post, index) => {
        console.log(`🧱 Carrusel post #${index + 1}:`, post.title || post.content);
        
        let etiquetas = [];
        try {
            const parsed = JSON.parse(post.etiquetas);
            if (Array.isArray(parsed)) {
                etiquetas = parsed.map(item => item.value);
            }
        } catch (err) {
            console.warn('⚠️ No se pudo parsear etiquetas:', post.etiquetas);
        }

        return `
            <div class="post">
                <div class="ctn-img">
                    <img src="${post.imageUrl || '../img/default.jpg'}" alt="Post image">
                </div>
                <h3>${post.title || 'Sin título'}</h3>
                <span>${new Date(post.created_at).toLocaleDateString()}</span>
                <ul class="ctn-tags">
                    ${etiquetas.map(tag => `<li>${tag.trim()}</li>`).join('')}
                </ul>
                <a href="/posts/blog${post.id}.html">
                    <button>Leer más</button>
                </a>
            </div>
        `;
    }).join('');

    document.getElementById('carousel-posts').innerHTML = carruselHTML;

    
    // ================================
    // 📚 Sección "Todos los Posts"
    // ================================
    const allPostsContainer = document.getElementById("all-posts");
    const remainingPosts = posts.slice(10); // Del 11 en adelante

    const todosHTML = remainingPosts.map(post => {
        let etiquetas = [];
        try {
            const parsed = JSON.parse(post.etiquetas);
            if (Array.isArray(parsed)) {
                etiquetas = parsed.map(item => item.value);
            }
        } catch (err) {
            console.warn('⚠️ Etiquetas malformadas:', post.etiquetas);
        }

        return `
            <div class="post-card">
                <img src="${post.imageUrl || '../img/default.jpg'}" alt="${post.title || 'Post'}">
                <h3>${post.title || 'Sin título'}</h3>
                <span>${new Date(post.created_at).toLocaleDateString()}</span>
                <ul class="ctn-tags">
                    ${etiquetas.map(tag => `<li>${tag}</li>`).join('')}
                </ul>
                <a href="/posts/blog${post.id}.html">
                    <button>Leer más</button>
                </a>
            </div>
        `;
    }).join('');

    if (allPostsContainer) {
        allPostsContainer.innerHTML = todosHTML;
    }

        // --- Llamada a la traducción después de cargar todos los posts (carrusel y resto) ---
        if (currentLang !== 'es') {
          await translatePageContent(currentLang);
        }
}
        else {
            console.warn("⚠️ No se pudo cargar el carrusel, respuesta no exitosa:", success);
            
                        
        }
    } catch (err) {
        console.error("❌ Error cargando posts en carrusel:", err);
    }
});

document.addEventListener("DOMContentLoaded", function () {
  const userName = localStorage.getItem("userName") || "Invitado";
  const commentInput = document.getElementById("commentInput");
  const sendButton = document.getElementById("sendComment");
  const commentsList = document.getElementById("commentsList");
  const verMasBtn = document.getElementById("verMasBtn");
// Agrega listeners para los botones del modal de login
const btnLogin = document.getElementById("btnLogin");
const btnContinue = document.getElementById("btnContinue");

if (btnLogin) {
  btnLogin.addEventListener("click", () => {
    location.href = "/login/login.html";
  });
}

if (btnContinue) {
  btnContinue.addEventListener("click", () => {
    const loginModal = document.getElementById("loginModal");
    if (loginModal) loginModal.classList.remove("show");
    // No hacer nada más, solo cerrar el modal
  });
}


  sendButton.addEventListener("click", guardarComentario);


  // Mostrar inicial del usuario en el avatar
  const avatarInicial = document.getElementById("avatarInicial");
  if (avatarInicial) {
    avatarInicial.textContent = userName.charAt(0).toUpperCase();
  }

  function crearComentario(nombre, texto) {
    const div = document.createElement("div");
    div.className = "comentario";
    div.innerHTML = `
      <div class="nombre">${nombre}</div>
      <div class="texto">${texto}</div>
    `;
    return div;
  }

  function cargarComentarios(mostrarTodos = false) {
    const comentarios = JSON.parse(localStorage.getItem("comentariosMenu")) || [];
    commentsList.innerHTML = "";

    const MAX_VISIBLES = 5;
    const visibles = mostrarTodos ? comentarios : comentarios.slice(0, MAX_VISIBLES);

    visibles.forEach(com => {
      const div = crearComentario(com.nombre, com.texto);
      commentsList.appendChild(div);
    });

    if (comentarios.length > MAX_VISIBLES) {
      verMasBtn.style.display = "inline-block";
      verMasBtn.textContent = mostrarTodos ? "Ver menos" : "Ver más";
      verMasBtn.onclick = () => cargarComentarios(!mostrarTodos);
    } else {
      verMasBtn.style.display = "none";
    }
    // --- Llamada a la traducción después de cargar comentarios ---
    if (currentLang !== 'es') {
      setTimeout(() => translatePageContent(currentLang), 50); // Pequeño retraso para asegurar que los elementos estén en el DOM
    }
  }

function guardarComentario() {
  const texto = commentInput.value.trim();
  if (texto === "") return;

  const userName = localStorage.getItem("userName");

  if (!userName || userName === "Invitado") {
    // Mostrar el modal
    document.getElementById("loginModal").classList.add("show");
    return;
  }

  guardarComentarioComo(userName);
}

// Esta función sí guarda el comentario
function guardarComentarioComo(nombre) {
  const texto = commentInput.value.trim();
  if (texto === "") return;

  const comentarios = JSON.parse(localStorage.getItem("comentariosMenu")) || [];
  comentarios.push({ nombre, texto });
  localStorage.setItem("comentariosMenu", JSON.stringify(comentarios));
  commentInput.value = "";
  cargarComentarios(); // Volver a cargar para mostrar el nuevo comentario
}

window.addEventListener("click", (e) => {
  const loginModal = document.getElementById("loginModal");
  if (e.target === loginModal) {
    loginModal.classList.remove("show");
  }
});

// Cargar comentarios al inicio
cargarComentarios();
});

function mostrarBienvenida(mensaje) {
  const toast = document.getElementById("bienvenidaToast");
  const msg = document.getElementById("bienvenidaMensaje");

  if (toast && msg) {
    msg.textContent = mensaje;
    toast.classList.remove("hidden");
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
      toast.classList.add("hidden");
    }, 4000); // Se oculta después de 4 segundos
  }
}