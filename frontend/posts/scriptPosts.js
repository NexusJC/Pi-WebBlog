const API_BASE_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:3001"
  : "https://www.ecolima.blog";

document.addEventListener("DOMContentLoaded", () => {
  const nombre = localStorage.getItem("userName") || "Usuario";
  const avatar = document.getElementById("avatarInicial");

  if (avatar) {
    avatar.textContent = nombre.charAt(0).toUpperCase(); // ✅ CORREGIDO
  }

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
  const userId = localStorage.getItem("userId");

  if (!sendBtn || !input || !postId) return;

  sendBtn.addEventListener("click", () => {
    // 👇 Evita que usuarios no registrados comenten
    if (!userId) {
      const modal = document.getElementById("commentModal");
      if (modal) {
        modal.style.display = "flex";
        document.getElementById("btnLogin")?.addEventListener("click", () => {
          window.location.href = "/login/login.html";
        });
        document.getElementById("btnContinue")?.addEventListener("click", () => {
          modal.style.display = "none";
        });
      }
      return;
    }

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
        location.reload(); // puedes optimizar esto si quieres evitar recarga completa
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
    const { success, comments } = await res.json();

    if (!success || !Array.isArray(comments)) return;

    const html = comments.map(comment => {
      const isAuthor = comment.user_id == currentUserId;
      return `
        <div class="comment" data-id="${comment.id}">
          <p><strong>${comment.user_name || "Invitado"}:</strong></p>
          <p class="comment-text">${comment.content}</p>
          ${isAuthor ? `
            <div class="comment-actions">
              <button class="edit-comment">✏️ Editar</button>
              <button class="delete-comment">🗑️ Eliminar</button>
            </div>
          ` : ""}
        </div>
      `;
    }).join("");

    container.innerHTML = html;

    // Agrega eventos de editar y eliminar
    document.querySelectorAll(".edit-comment").forEach(btn => {
      btn.addEventListener("click", e => {
        const commentDiv = e.target.closest(".comment");
        const commentId = commentDiv.dataset.id;
        const textP = commentDiv.querySelector(".comment-text");
        const originalText = textP.textContent;

        textP.style.display = "none";

        const textarea = document.createElement("textarea");
        textarea.className = "edit-input";
        textarea.value = originalText;

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "💾 Guardar";
        saveBtn.className = "save-edit";

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "❌ Cancelar";
        cancelBtn.className = "cancel-edit";

        commentDiv.appendChild(textarea);
        commentDiv.appendChild(saveBtn);
        commentDiv.appendChild(cancelBtn);

        saveBtn.addEventListener("click", async () => {
          const newContent = textarea.value.trim();
          if (!newContent) return;

          const res = await fetch(`${API_BASE_URL}/api/comments/${commentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: newContent, userId: currentUserId })
          });

          const data = await res.json();
          if (data.success) {
            mostrarComentarios();
          } else {
            alert("❌ No se pudo actualizar el comentario.");
          }
        });

        cancelBtn.addEventListener("click", () => {
          mostrarComentarios();
        });
      });
    });

    document.querySelectorAll(".delete-comment").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const commentDiv = e.target.closest(".comment");
        const commentId = commentDiv.dataset.id;

        const confirmDelete = confirm("¿Eliminar este comentario?");
        if (!confirmDelete) return;

        const res = await fetch(`${API_BASE_URL}/api/comments/${commentId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUserId })
        });

        const data = await res.json();
        if (data.success) {
          mostrarComentarios();
        } else {
          alert("❌ No se pudo eliminar el comentario.");
        }
      });
    });

  } catch (err) {
    console.error("❌ Error al mostrar comentarios:", err);
  }
}
