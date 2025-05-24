// BUSCADOR DE CONTENIDO
// Declarar elementos importantes del buscador
const bars_search = document.getElementById("ctn-bars-search");
const cover_ctn_search = document.getElementById("cover-ctn-search");
const inputSearch = document.getElementById("inputSearch");
const box_search = document.getElementById("box-search");

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
        const response = await fetch("http://localhost:3001/api/posts");
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


    // Carrusel horizontal
    const postsContainer = document.querySelector(".posts");
    if (postsContainer) {
        const postWidth = postsContainer.querySelector(".post")?.offsetWidth + 20 || 320;
        let scrollAmount = 0;

        function autoScroll() {
            scrollAmount += postWidth;
            if (scrollAmount >= postsContainer.scrollWidth - postsContainer.offsetWidth) {
                scrollAmount = 0;
            }
            postsContainer.scrollTo({ left: scrollAmount, behavior: "smooth" });
        }

        setInterval(autoScroll, 3500);

        const leftArrow = document.querySelector(".left-arrow");
        const rightArrow = document.querySelector(".right-arrow");

        if (leftArrow && rightArrow) {
            leftArrow.addEventListener("click", () => {
                scrollAmount -= postWidth;
                if (scrollAmount < 0) scrollAmount = 0;
                postsContainer.scrollTo({ left: scrollAmount, behavior: "smooth" });
            });

            rightArrow.addEventListener("click", () => {
                scrollAmount += postWidth;
                if (scrollAmount > postsContainer.scrollWidth - postsContainer.offsetWidth) {
                    scrollAmount = postsContainer.scrollWidth - postsContainer.offsetWidth;
                }
                postsContainer.scrollTo({ left: scrollAmount, behavior: "smooth" });
            });
        }
    }

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
  const postsContainer = document.querySelector(".posts");
  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");

  if (postsContainer && leftArrow && rightArrow) {
    const postWidth = document.querySelector(".post")?.offsetWidth || 300; // fallback

    rightArrow.addEventListener("click", () => {
      postsContainer.scrollLeft += postWidth + 20;
    });

    leftArrow.addEventListener("click", () => {
      postsContainer.scrollLeft -= postWidth + 20;
    });
  } else {
    console.warn("⚠️ Carousel elements not found in DOM.");
  }
});


document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('carousel-posts');
    try {
        const response = await fetch('http://localhost:3001/api/posts');
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
                <a href="http://localhost:3001/posts/blog${post.id}.html">
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
                <a href="http://localhost:3001/posts/blog${post.id}.html">
                    <button>Leer más</button>
                </a>
            </div>
        `;
    }).join('');

    if (allPostsContainer) {
        allPostsContainer.innerHTML = todosHTML;
    }
}
        else {
            console.warn("⚠️ No se pudo cargar el carrusel, respuesta no exitosa:", success);
            
                        
        }
    } catch (err) {
        console.error("❌ Error cargando posts en carrusel:", err);
    }
});

