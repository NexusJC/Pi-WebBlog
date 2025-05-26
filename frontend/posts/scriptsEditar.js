

const API_BASE_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:3001"
  : "https://www.ecolima.blog";
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

if (!postId) {
  alert("❌ No se proporcionó un ID de post");
  throw new Error("Falta ID");
}

// Instanciar Quill y Tagify
let quill;
const inputTag = document.querySelector("#post-tags");
const tagify = new Tagify(inputTag, {
  maxTags: 3,
  dropdown: {
    enabled: 0
  }
});


// Cargar datos del post
async function cargarPost() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/posts/${postId}`);
    if (!res.ok) throw new Error("Post no encontrado");

    const post = await res.json();

    document.getElementById("post-title").value = post.title;
    document.getElementById("mensaje-autor").value = post.mensaje_autor || "";
    document.getElementById("referencias").value = post.referencias || "";

    // Rellenar etiquetas
    try {
      const tags = JSON.parse(post.etiquetas || "[]");
      tagify.addTags(tags.map(t => t.value));
    } catch (e) {
      console.warn("⚠️ Error al parsear etiquetas");
    }

    // Rellenar contenido en Quill
    quill.root.innerHTML = post.content;

  } catch (err) {
    console.error(err);
    alert("Error al cargar el post");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Iniciar Quill
  quill = new Quill("#editor", {
    theme: "snow"
  });

  cargarPost();

const fileInput = document.getElementById("real-input");
const fileNameSpan = document.querySelector(".file-name");
const imagePreview = document.getElementById("image-preview"); // Este debe estar en tu HTML

// Mostrar nombre de archivo y vista previa
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  const fileName = file?.name || "No hay imagen seleccionada";
  fileNameSpan.textContent = fileName;

  // Vista previa
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target.result;
      imagePreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.src = "";
    imagePreview.style.display = "none";
  }
});

// Habilitar botón personalizado para subir
document.querySelector(".img-autor").addEventListener("click", () => {
  fileInput.click();
});


  // Submit
  document.getElementById("editForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("post-title").value.trim();
    const content = quill.root.innerHTML;
    const mensaje_autor = document.getElementById("mensaje-autor").value.trim();
    const referencias = document.getElementById("referencias").value.trim();
    const etiquetas = tagify.value.map(tag => tag.value);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("mensaje_autor", mensaje_autor);
    formData.append("referencias", referencias);
    formData.append("tags", JSON.stringify(etiquetas));

    const imageFile = fileInput.files[0];
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
        const res = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
        method: "PUT",
        body: formData
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Post actualizado con éxito");
        window.location.href = `/posts/blog${postId}.html`;
      } else {
        alert("❌ Error al actualizar: " + (result.message || "desconocido"));
      }

    } catch (error) {
      console.error("❌ Error al actualizar post:", error.message, error.stack);
      alert("❌ Error al enviar los datos");
    }
  });
});