function ocultar_buscador() {
  bars_search.style.top = "-10rem";
  cover_ctn_search.style.display = "none";
  inputSearch.value = "";
  box_search.style.display = "none";
}

function mostrar_buscador() {
  bars_search.style.top = "5rem";
  cover_ctn_search.style.display = "block";
  inputSearch.focus();

  if (inputSearch.value === "") {
    box_search.style.display = "none";
  }
}

async function cargarPosts() {
  const res = await fetch("/api/posts");
  const data = await res.json();
  const posts = data.posts;

  const tbody = document.querySelector("#postsTable tbody");
  tbody.innerHTML = "";

  posts.forEach(post => {
    const postFile = `blog${post.id}.html`;
    const editUrl = `/posts/editarPosts.html?id=${post.id}`;


    const tr = document.createElement("tr");
    const fecha = new Date(post.created_at).toLocaleDateString("es-ES");

tr.innerHTML = `
  <td>${post.title || "Sin título"}</td>
  <td>${fecha}</td> <!-- ✅ Mostrar fecha -->
  <td>
    <a href="/posts/${postFile}" target="_blank">
      <button>Ver post</button>
    </a>
  </td>
  <td>
    <a href="${editUrl}">
      <button>Editar</button>
    </a>
  </td>
  <td>
    <button onclick="borrarPost('${post.id}')">Eliminar</button>
  </td>
`;

    tbody.appendChild(tr);
  });
}



function borrarPost(id) {
  const confirmar = confirm("¿Seguro que deseas eliminar este post?");
  if (!confirmar) return;

  const API_BASE = location.hostname === "localhost"
    ? "http://localhost:3001"
    : "https://ecolima-backend.up.railway.app"; // 🔁 Cambia esto si tu backend tiene otro dominio

  fetch(`${API_BASE}/api/posts/${id}`, {
    method: "DELETE"
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error al eliminar el post");
      alert("Post eliminado correctamente");
      location.reload();
    })
    .catch((err) => {
      console.error(err);
      alert("Error al eliminar el post");
    });
}



document.addEventListener("DOMContentLoaded", () => {
  const iconMenu = document.getElementById("icon-menu");
  const menu = document.querySelector(".menu");

  if (iconMenu && menu) {
    iconMenu.addEventListener("click", function () {
      menu.classList.toggle("show-lateral");
    });
  }

  // ✅ Cargar los posts al cargar la página
  cargarPosts();
});
