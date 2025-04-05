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

document.addEventListener("DOMContentLoaded", function () {
    const postsContainer = document.querySelector(".posts");
    let scrollAmount = 0;

    function autoScroll() {
        const postWidth = postsContainer.querySelector(".post").offsetWidth + 20; // Ancho del post + gap
        scrollAmount += postWidth;

        // Si llega al final, vuelve al inicio
        if (scrollAmount >= postsContainer.scrollWidth - postsContainer.offsetWidth) {
            scrollAmount = 0;
        }

        postsContainer.scrollTo({
            left: scrollAmount,
            behavior: "smooth", // Movimiento más fluido
        });
    }

    // Ejecutar el desplazamiento automáticamente cada 1 segundo
    setInterval(autoScroll, 3500);
});

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