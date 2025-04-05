document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const postForm = document.getElementById('postForm');
    const fileInput = document.getElementById('real-input');
    const mensajeAutorInput = document.getElementById('mensaje-autor');
    const fileNameElement = document.querySelector('.file-name');
    const imgAutorBtn = document.querySelector('.img-autor');
    
    // Inicializar Quill Editor
    const quill = new Quill("#editor", {
        theme: "snow",
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                ['link', 'image'],
                ['clean']
            ]
        },
        placeholder: 'Escribe tu contenido aquí...',
        bounds: document.getElementById('editor')
    });

    // Manejador de selección de archivos
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            
            if (file) {
                fileNameElement.textContent = file.name;
                
                // Vista previa de imagen
                const reader = new FileReader();
                reader.onload = function(event) {
                    let preview = document.getElementById('preview');
                    if (!preview) {
                        preview = document.createElement('img');
                        preview.id = 'preview';
                        preview.style.maxWidth = '100%';
                        preview.style.maxHeight = '200px';
                        preview.style.marginTop = '10px';
                        preview.style.borderRadius = '4px';
                        preview.style.objectFit = 'contain';
                        document.querySelector('.img-autor--container').appendChild(preview);
                    }
                    preview.src = event.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                fileNameElement.textContent = 'No hay imagen seleccionada';
                const preview = document.getElementById('preview');
                if (preview) preview.style.display = 'none';
            }
        });
    }

    // Activar el input file al hacer clic en el botón
    if (imgAutorBtn) {
        imgAutorBtn.addEventListener('click', function() {
            fileInput.click();
        });
    }

    // Envío del formulario
    if (postForm) {
        postForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = postForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publicando...';

            try {
                // Validación básica
                const mensajeAutor = mensajeAutorInput.value.trim();
                const editorContent = quill.root.innerHTML.trim();
                
                if (!mensajeAutor || editorContent === '<p><br></p>') {
                    throw new Error('Por favor completa todos los campos requeridos');
                }

                // Crear FormData
                const formData = new FormData();
                formData.append('user_id', '1'); // Cambiar por ID real del usuario logueado
                formData.append('content', editorContent);
                // En el event listener del formulario:
                formData.append('mensaje_autor', mensajeAutorInput.value.trim()); // Cambiado a mensaje_autor
                
                // Validar y añadir imagen
                if (fileInput.files[0]) {
                    if (fileInput.files[0].size > 5 * 1024 * 1024) {
                        throw new Error('La imagen no debe exceder los 5MB');
                    }
                    formData.append('image', fileInput.files[0]);
                }

                // Enviar datos al servidor
                const response = await fetch('http://localhost:3001/api/posts', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error en el servidor');
                }

                const data = await response.json();

                // Éxito - resetear formulario
                showAlert('✅ Post creado exitosamente!', 'success');
                quill.root.innerHTML = '';
                mensajeAutorInput.value = '';
                fileInput.value = '';
                fileNameElement.textContent = 'No hay imagen seleccionada';
                const preview = document.getElementById('preview');
                if (preview) preview.style.display = 'none';
                
                // Recargar posts
                await loadPosts();

            } catch (error) {
                console.error("Error al enviar el formulario:", error);
                showAlert(`❌ ${error.message}`, 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

    // Cargar posts al iniciar
    loadPosts();
});

// Función para cargar y mostrar posts
async function loadPosts() {
    try {
        const response = await fetch('http://localhost:3001/api/posts');
        
        if (!response.ok) {
            throw new Error('Error al cargar los posts');
        }

        const { success, posts } = await response.json();
        
        if (success && posts) {
            const container = document.getElementById('posts-container');
            if (container) {
                container.innerHTML = posts.map(post => `
                    <article class="post-card">
                        <div class="post-content">${post.content}</div>
                        ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Imagen del post" class="post-image">` : ''}
                        <div class="post-meta">
                            <span class="post-author">Por: ${post.author_name || 'Anónimo'}</span>
                            <span class="post-date">${new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <blockquote class="post-message">${post['mensaje-autor']}</blockquote>
                    </article>
                `).join('');
            }
        }
    } catch (error) {
        console.error("Error al cargar posts:", error);
        showAlert('Error al cargar los posts', 'error');
    }
}

// Función para mostrar alertas
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.padding = '10px 20px';
    alertDiv.style.borderRadius = '4px';
    alertDiv.style.zIndex = '1000';
    alertDiv.style.backgroundColor = type === 'error' ? '#ffebee' : '#e8f5e9';
    alertDiv.style.color = type === 'error' ? '#c62828' : '#2e7d32';
    alertDiv.style.border = `1px solid ${type === 'error' ? '#ef9a9a' : '#a5d6a7'}`;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
}

// Advertencia al salir con cambios no guardados
window.addEventListener('beforeunload', (e) => {
    const quill = document.querySelector('#editor') ? new Quill('#editor') : null;
    const mensajeAutor = document.getElementById('mensaje-autor')?.value.trim();
    const hasFile = document.getElementById('real-input')?.files.length > 0;
    
    const hasContent = (quill && quill.root.innerHTML.trim() !== '<p><br></p>') || 
                      (mensajeAutor && mensajeAutor !== '') || 
                      hasFile;
    
    if (hasContent) {
        e.preventDefault();
        e.returnValue = 'Tienes cambios no guardados. ¿Seguro que quieres salir?';
    }
});