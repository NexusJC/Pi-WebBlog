const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const form = document.getElementById("editForm");

async function cargarPost() {
  try {
    const res = await fetch(`/api/posts/${postId}`);
    if (!res.ok) throw new Error("No se pudo obtener el post");

    const data = await res.json();
    titleInput.value = data.title || "";
    contentInput.value = data.content || "";
  } catch (error) {
    alert("Error al cargar el post");
    console.error(error);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const actualizado = {
    title: titleInput.value,
    content: contentInput.value
  };

  try {
    const res = await fetch(`/api/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(actualizado)
    });

    if (res.ok) {
      alert("Post actualizado correctamente");
      window.location.href = "/menu/index.html"; // Cambia a la página a la que quieres volver
    } else {
      alert("Error al actualizar el post");
    }
  } catch (error) {
    alert("Error de red al actualizar");
    console.error(error);
  }
});

cargarPost();
