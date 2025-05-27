const API_BASE_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:3001"
  : "https://www.ecolima.blog";


// Evento para mostrar el menú
document.getElementById('icon-menu').addEventListener('click', function () {
    document.querySelector('.menu').classList.toggle('show-lateral');
});

// Eventos del buscador
document.getElementById("icon-search").addEventListener("click", mostrar_buscador);
document.getElementById("cover-ctn-search").addEventListener("click", ocultar_buscador);

// Declaración de variables del buscador
let bars_search = document.getElementById("ctn-bars-search");
let cover_ctn_search = document.getElementById("cover-ctn-search");
let inputSearch = document.getElementById("inputSearch");
let box_search = document.getElementById("box-search");

document.addEventListener("DOMContentLoaded", () => {
    const iconMenu = document.getElementById('icon-menu');
    const menu = document.querySelector('.menu');

    if (iconMenu && menu) {
        iconMenu.addEventListener('click', function () {
            menu.classList.toggle('show-lateral');
        });
    }
});

// Función para mostrar el buscador
function mostrar_buscador() {
    if (window.innerWidth <= 800) {
        document.querySelector('.menu').classList.remove('show-lateral');
    }

    bars_search.style.top = "5rem";
    cover_ctn_search.style.display = "block";
    inputSearch.focus();

    if (inputSearch.value === "") {
        box_search.style.display = "none";
    }
}

// Función para ocultar el buscador
function ocultar_buscador() {
    bars_search.style.top = "-10rem";
    cover_ctn_search.style.display = "none";
    inputSearch.value = "";
    box_search.style.display = "none";
}

// Función para el filtrado de búsqueda
document.getElementById("inputSearch").addEventListener("keyup", buscador_interno);

function buscador_interno() {
    let filter = inputSearch.value.toUpperCase();
    let li = box_search.getElementsByTagName("li");

    for (let i = 0; i < li.length; i++) {
        let a = li[i].getElementsByTagName("a")[0];
        let textValue = a.textContent || a.innerText;

        if (textValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
            box_search.style.display = "block";
        } else {
            li[i].style.display = "none";
        }
    }

    if (inputSearch.value === "") {
        box_search.style.display = "none";
    }
}

// ✅ Scroll automático de contenido relacionado
document.addEventListener('DOMContentLoaded', async () => {
  const relatedContainer = document.getElementById('related-posts-container');
  if (!relatedContainer) return;

  try {
    const response = await fetch(`${API_BASE_URL}/api/posts`);
    const { success, posts } = await response.json();

    if (success) {
      const ultimosPosts = [...posts]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

      const html = ultimosPosts.map(post => {
        let etiquetas = [];

        try {
          const parsed = JSON.parse(post.etiquetas);
          if (Array.isArray(parsed)) {
            etiquetas = parsed.map(item => item.value);
          }
        } catch (err) {
          console.warn('⚠️ Etiquetas malformadas en contenido relacionado:', post.etiquetas);
        }

        return `
          <div class="related-item">
            <img src="${post.imageUrl || '../img/default.jpg'}" alt="Imagen del post">
            <h4>${post.title || 'Sin título'}</h4>
            <p>${(post.content || '').replace(/<[^>]+>/g, '').slice(0, 50)}...</p>
            <a href="/posts/blog${post.id}.html">
              <button>Ver más</button>
            </a>
          </div>
        `;
      }).join('');

      relatedContainer.innerHTML = html;
    } else {
      console.warn("⚠️ No se pudo cargar contenido relacionado.");
    }
  } catch (err) {
    console.error("❌ Error al cargar contenido relacionado:", err);
  }
});


// Like y lógica general
document.addEventListener("DOMContentLoaded", () => {
  const postDiv = document.querySelector(".post");
  const postId = postDiv?.dataset?.id;
  const likeButton = postDiv?.querySelector(".like-button");

  if (!postDiv || !likeButton) return;

  const userId = localStorage.getItem("userId");
  const likeCountSpan = likeButton.querySelector(".like-count");

  const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
  const yaLeDioLike = likedPosts.includes(postId);

  fetch(`${API_BASE_URL}/api/posts/${postId}/likes?userId=${userId}`)
    .then(res => res.json())
    .then(data => {
      likeCountSpan.textContent = data.likes;
      if (data.hasLiked || yaLeDioLike) {
        likeButton.classList.add("liked");
        likeButton.innerHTML = `💔 Quitar like <span class="like-count">${data.likes}</span>`;
      } else {
        likeButton.innerHTML = `❤️ Me gusta <span class="like-count">${data.likes}</span>`;
      }
    });

  likeButton.addEventListener("click", () => {
    if (!userId) {
      const modal = document.getElementById("likeModal");
      modal.style.display = "flex";
      document.getElementById("goToLoginLike").onclick = () => {
        window.location.href = "/login/login.html";
      };
      document.getElementById("stayGuestLike").onclick = () => {
        cerrarModal("likeModal");
      };
      return;
    }

    const liked = likeButton.classList.contains("liked");
    const method = liked ? "DELETE" : "POST";

    fetch(`${API_BASE_URL}/like/${postId}`, {
      method,
      headers: { "Content-Type": "application/json" }
    })
    .then(res => res.json())
    .then(data => {
      const likesCount = typeof data.likes === "number" ? data.likes : 0;
      likeCountSpan.textContent = likesCount;

      let likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");

      if (liked) {
        likeButton.classList.remove("liked");
        likeButton.innerHTML = `❤️ Me gusta <span class="like-count">${likesCount}</span>`;
        likedPosts = likedPosts.filter(id => id !== postId);
      } else {
        likeButton.classList.add("liked");
        likeButton.innerHTML = `💔 Quitar like <span class="like-count">${likesCount}</span>`;
        likedPosts.push(postId);
      }

      localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
    });
  });
});



