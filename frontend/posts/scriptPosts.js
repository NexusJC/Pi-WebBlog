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
document.addEventListener("DOMContentLoaded", () => {
    const relatedContainer = document.querySelector('.related-items-container');
    const relatedItems = relatedContainer ? relatedContainer.querySelectorAll('.related-item') : [];

    if (relatedContainer && relatedItems.length > 0) {
        let currentIndex = 0;

        function scrollToItem(index) {
            const itemHeight = relatedItems[0].offsetHeight + 10; // espacio entre elementos
            relatedContainer.scrollTo({
                top: index * itemHeight,
                behavior: 'smooth'
            });
        }

        function autoScrollRelated() {
            currentIndex = (currentIndex + 1) % relatedItems.length;
            scrollToItem(currentIndex);
        }

        setInterval(autoScrollRelated, 6000); // cada 3 segundos
    }
});

document.addEventListener("DOMContentLoaded", () => {
  const postDiv = document.querySelector(".post");
  const postId = postDiv?.dataset?.id;
  const likeButton = postDiv?.querySelector(".like-button");

  if (!postDiv || !likeButton) return;

  const userId = localStorage.getItem("userId");
  const likeCountSpan = likeButton.querySelector(".like-count");

  // Obtener estado inicial
  fetch(`/api/posts/${postId}/likes?userId=${userId}`)
    .then(res => res.json())
    .then(data => {
      likeCountSpan.textContent = data.likes;
      if (data.hasLiked) {
        likeButton.classList.add("liked");
        likeButton.innerHTML = `💔 Quitar like <span class="like-count">${data.likes}</span>`;
      } else {
        likeButton.innerHTML = `❤️ Me gusta <span class="like-count">${data.likes}</span>`;
      }
    });

  // Toggle like
likeButton.addEventListener("click", () => {
  if (!userId) {
    const modal = document.getElementById("loginModal");
    modal.style.display = "flex";

    // Botones del modal
    document.getElementById("goToLogin").onclick = () => {
      window.location.href = "/login/login.html";
    };

    document.getElementById("stayGuest").onclick = () => {
      modal.style.display = "none";
    };

    return;
  }

  // Aquí sigue el código para dar o quitar like
  const liked = likeButton.classList.contains("liked");
  const method = liked ? "DELETE" : "POST";

  fetch(`/like/${postId}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  })
    .then(res => res.json())
    .then(data => {
      likeCountSpan.textContent = data.likes;
      if (liked) {
        likeButton.classList.remove("liked");
        likeButton.innerHTML = `❤️ Me gusta <span class="like-count">${data.likes}</span>`;
      } else {
        likeButton.classList.add("liked");
        likeButton.innerHTML = `💔 Quitar like <span class="like-count">${data.likes}</span>`;
      }
    });
});

});


