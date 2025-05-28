const API_BASE_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:3001"
  : "https://www.ecolima.blog";

document.addEventListener("DOMContentLoaded", () => {
  inicializarMenu();
  inicializarBuscador();
  cargarContenidoRelacionado();
  manejarLikes();
  manejarComentarios();
  mostrarComentarios(); 
});


// 📌 MENÚ LATERAL
function inicializarMenu() {
  const iconMenu = document.getElementById("icon-menu");
  const menu = document.querySelector(".menu");
  if (iconMenu && menu) {
    iconMenu.addEventListener("click", () => {
      menu.classList.toggle("show-lateral");
    });
  }
}


// 📌 BUSCADOR
function inicializarBuscador() {
  const bars_search = document.getElementById("ctn-bars-search");
  const cover_ctn_search = document.getElementById("cover-ctn-search");
  const inputSearch = document.getElementById("inputSearch");
  const box_search = document.getElementById("box-search");

  document.getElementById("icon-search").addEventListener("click", () => {
    if (window.innerWidth <= 800) {
      document.querySelector(".menu").classList.remove("show-lateral");
    }
    bars_search.style.top = "5rem";
    cover_ctn_search.style.display = "block";
    inputSearch.focus();

    if (inputSearch.value === "") {
      box_search.style.display = "none";
    }
  });

  cover_ctn_search.addEventListener("click", () => {
    bars_search.style.top = "-10rem";
    cover_ctn_search.style.display = "none";
    inputSearch.value = "";
    box_search.style.display = "none";
  });

  inputSearch.addEventListener("keyup", () => {
    const filter = inputSearch.value.toUpperCase();
    const li = box_search.getElementsByTagName("li");

    let hasResults = false;
    for (let i = 0; i < li.length; i++) {
      const a = li[i].getElementsByTagName("a")[0];
      const textValue = a.textContent || a.innerText;
      const visible = textValue.toUpperCase().includes(filter);
      li[i].style.display = visible ? "" : "none";
      if (visible) hasResults = true;
    }

    box_search.style.display = hasResults ? "block" : "none";
  });
}

// 📌 CARGAR CONTENIDO RELACIONADO
async function cargarContenidoRelacionado() {
  const container = document.getElementById("related-posts-container");
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE_URL}/api/posts`);
    const { success, posts } = await res.json();
    if (!success) return;

    const ultimosPosts = posts
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);

    const html = ultimosPosts.map(post => {
      let etiquetas = [];
      try {
        etiquetas = JSON.parse(post.etiquetas || "[]").map(e => e.value);
      } catch {}

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
    }).join("");

    container.innerHTML = html;
  } catch (err) {
    console.error("❌ Error al cargar contenido relacionado:", err);
  }
}

// 📌 LIKE BUTTON
function manejarLikes() {
  const postDiv = document.querySelector(".post");
  const postId = postDiv?.dataset?.id;
  const likeButton = postDiv?.querySelector(".like-button");

  if (!postDiv || !likeButton) return;

  const userId = localStorage.getItem("userId");
  const likeCountSpan = likeButton.querySelector(".like-count");

  const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
  const yaLeDioLike = likedPosts.includes(postId);

  fetch(`${API_BASE_URL}/api/posts/${postId}/likes`)
    .then(res => res.json())
    .then(data => {
      const likes = data.likes || 0;
      likeCountSpan.textContent = likes;

      if (yaLeDioLike) {
        likeButton.classList.add("liked");
        likeButton.innerHTML = `💔 Quitar like <span class="like-count">${likes}</span>`;
      } else {
        likeButton.classList.remove("liked");
        likeButton.innerHTML = `❤️ Me gusta <span class="like-count">${likes}</span>`;
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
        modal.style.display = "none";
      };
      return;
    }

    const liked = likeButton.classList.contains("liked");
    const method = liked ? "DELETE" : "POST";

    fetch(`${API_BASE_URL}/like/${postId}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    })
      .then(res => res.json())
      .then(data => {
        const likes = typeof data.likes === "number" ? data.likes : 0;
        likeCountSpan.textContent = likes;

        let likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");

        if (liked) {
          likeButton.classList.remove("liked");
          likeButton.innerHTML = `❤️ Me gusta <span class="like-count">${likes}</span>`;
          likedPosts = likedPosts.filter(id => id !== postId);
        } else {
          likeButton.classList.add("liked");
          likeButton.innerHTML = `💔 Quitar like <span class="like-count">${likes}</span>`;
          likedPosts.push(postId);
        }

        localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
      });
  });
}

// 📌 COMENTARIOS
function manejarComentarios() {
  const sendBtn = document.getElementById("sendComment");
  const input = document.getElementById("commentInput");
  const postDiv = document.querySelector(".post");
  const postId = postDiv?.dataset?.id;
  const userId = localStorage.getItem("userId") || null;

  if (!sendBtn || !input || !postId) return;

  sendBtn.addEventListener("click", () => {
    const content = input.value.trim();
    if (!content) return;

    fetch(`${API_BASE_URL}/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, userId, content })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        input.value = "";
        alert("✅ Comentario enviado.");
        location.reload(); // o recargar solo la sección de comentarios si prefieres
      } else {
        alert("❌ No se pudo enviar el comentario.");
      }
    })
    .catch(err => {
      console.error("❌ Error al enviar comentario:", err);
      alert("Error al enviar comentario.");
    });
  });
}

async function mostrarComentarios() {
  const postDiv = document.querySelector(".post");
  const postId = postDiv?.dataset?.id;
  const container = document.getElementById("commentsList");
  const currentUserId = localStorage.getItem("userId");
  if (!postId || !container) return;

  try {
    const res = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments`);
    const data = await res.json();
    if (!data.success) return;

    const html = data.comments.map(comment => {
      const user = comment.user_name || "Anónimo";
      const fecha = new Date(comment.created_at).toLocaleDateString();
      const canEdit = currentUserId && comment.user_id == currentUserId;

      return `
        <div class="comment" data-id="${comment.id}">
          <strong>${user}</strong> <span class="comment-date">${fecha}</span>
          <p class="comment-text">${comment.content}</p>
          ${canEdit ? `
            <button class="edit-comment">✏️ Editar</button>
            <button class="delete-comment">🗑️ Eliminar</button>
          ` : ''}
        </div>
      `;
    }).join("");

    container.innerHTML = html;

    // Eventos para eliminar
    document.querySelectorAll(".delete-comment").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const commentDiv = e.target.closest(".comment");
        const commentId = commentDiv.dataset.id;
        const confirmed = confirm("¿Eliminar este comentario?");
        if (!confirmed) return;

        const res = await fetch(`${API_BASE_URL}/api/comments/${commentId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUserId })
        });

        const data = await res.json();
        if (data.success) {
          commentDiv.remove();
        } else {
          alert("❌ No se pudo eliminar");
        }
      });
    });

    // Eventos para editar
    document.querySelectorAll(".edit-comment").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const commentDiv = e.target.closest(".comment");
        const commentId = commentDiv.dataset.id;
        const textP = commentDiv.querySelector(".comment-text");
        const original = textP.textContent;

        const newContent = prompt("Editar comentario:", original);
        if (newContent === null || newContent.trim() === "") return;

        const res = await fetch(`${API_BASE_URL}/api/comments/${commentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: newContent.trim(), userId: currentUserId })
        });

        const data = await res.json();
        if (data.success) {
          textP.textContent = newContent.trim();
        } else {
          alert("❌ No se pudo editar");
        }
      });
    });

  } catch (err) {
    console.error("❌ Error al mostrar comentarios:", err);
  }
}

