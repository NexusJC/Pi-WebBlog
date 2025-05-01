// BUSCADOR DE CONTENIDO

//Ejecutando funciones
document.getElementById("icon-search").addEventListener("click", mostrar_buscador);
document.getElementById("cover-ctn-search").addEventListener("click", ocultar_buscador); 



// Declarando variables 
bars_search = document.getElementById("ctn-bars-search");
cover_ctn_search = document.getElementById("cover-ctn-search");
inputSearch = document.getElementById("inputSearch");
box_search = document.getElementById("box-search");

//Funcion para mostrar el buscador 
document.addEventListener("DOMContentLoaded", () => {
    const iconMenu = document.getElementById('icon-menu');
    const menu = document.querySelector('.menu');

    if (iconMenu && menu) {
        iconMenu.addEventListener('click', function () {
            menu.classList.toggle('show-lateral');
        });
    }
});

function mostrar_buscador(){
    bars_search.style.top="5rem";
    cover_ctn_search.style.display="block";
    inputSearch.focus();

    if (inputSearch.value === ""){
        box_search.style.display ="none";
    }
}

//Funcion para ocultar el buscador

function ocultar_buscador(){
    bars_search.style.top="-10rem";
    cover_ctn_search.style.display="none";
    inputSearch.value="";
    inputSearch.value ="";
    box_search.style.display="none";
}


// Creando filtrado de busqueda 

document.getElementById("inputSearch").addEventListener("keyup", buscador_interno);

function buscador_interno() {
    filter = inputSearch.value.toUpperCase();
    li = box_search.getElementsByTagName("li");

    // Recorriendo elementos a filtrar mediante los "li"
    for (i = 0; i < li.length; i++){
        a = li[i].getElementsByTagName("a")[0];
        textValue = a.textContent || a.innerText;

        if(textValue.toUpperCase().indexOf(filter) > -1){
            li[i].style.display = "";
            box_search.style.display ="block";

            if (inputSearch.value === ""){
                box_search.style.display ="none";
            }

            a.addEventListener("click", ocultar_buscador);

        } else {
            li[i].style.display = "none";
        }
    }
}

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


document.addEventListener("DOMContentLoaded", function () {
    const postsContainer = document.querySelector(".posts");
    const leftArrow = document.querySelector(".left-arrow");
    const rightArrow = document.querySelector(".right-arrow");
    const postWidth = postsContainer.querySelector(".post").offsetWidth + 20; // Ancho del post + gap

    let scrollAmount = 0;
    const scrollSpeed = 1; // Velocidad del desplazamiento automático

    // Función para desplazamiento automático
    function autoScroll() {
        scrollAmount += scrollSpeed;

        if (scrollAmount >= postsContainer.scrollWidth - postsContainer.offsetWidth) {
            scrollAmount = 0;
        }

        postsContainer.scrollTo({
            left: scrollAmount,
            behavior: "smooth",
        });

        requestAnimationFrame(autoScroll);
        
    }


    // Función para desplazarse hacia la izquierda
    leftArrow.addEventListener("click", function () {
        scrollAmount -= postWidth;
        if (scrollAmount < 0) {
            scrollAmount = 0; // Evitar desplazamiento negativo
        }
        postsContainer.scrollTo({
            left: scrollAmount,
            behavior: "smooth",
        });
    });

    // Función para desplazarse hacia la derecha
    rightArrow.addEventListener("click", function () {
        scrollAmount += postWidth;
        if (scrollAmount >= postsContainer.scrollWidth - postsContainer.offsetWidth) {
            scrollAmount = postsContainer.scrollWidth - postsContainer.offsetWidth; // Evitar exceder el límite
        }
        postsContainer.scrollTo({
            left: scrollAmount,
            behavior: "smooth",
        });
    });

    // Iniciar desplazamiento automático
    autoScroll();
});

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('carousel-posts');
    try {
        const response = await fetch('http://localhost:3001/api/posts');
        const { success, posts } = await response.json();

        if (success) {
            // ⬇️ PONLO AQUÍ
            console.log("🧪 Posts recibidos del servidor:", posts);

            container.innerHTML = posts.slice(0, 10).map((post, index) => {
                console.log(`🧱 Renderizando post #${index + 1}:`, post.title || post.content);
            
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
            
                        
        }
    } catch (err) {
        console.error("❌ Error cargando posts en carrusel:", err);
    }
});

