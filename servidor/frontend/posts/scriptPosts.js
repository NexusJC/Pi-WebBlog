// Evento para mostrar el menú
document.getElementById('icon-menu').addEventListener('click', function() {
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

// Función para mostrar el buscador
function mostrar_buscador(){
    // Verifica si el tamaño de la pantalla es pequeño (menos de 800px)
    if (window.innerWidth <= 800) {
        // Cierra el menú lateral si está abierto
        document.querySelector('.menu').classList.remove('show-lateral');
    }

    bars_search.style.top="5rem";
    cover_ctn_search.style.display="block";
    inputSearch.focus();

    if (inputSearch.value === ""){
        box_search.style.display ="none";
    }
}

// Función para ocultar el buscador
function ocultar_buscador(){
    bars_search.style.top="-10rem";
    cover_ctn_search.style.display="none";
    inputSearch.value="";
    box_search.style.display="none";
}

// Función para el filtrado de búsqueda
document.getElementById("inputSearch").addEventListener("keyup", buscador_interno);

function buscador_interno() {
    let filter = inputSearch.value.toUpperCase();
    let li = box_search.getElementsByTagName("li");

    for (let i = 0; i < li.length; i++){
        let a = li[i].getElementsByTagName("a")[0];
        let textValue = a.textContent || a.innerText;

        if (textValue.toUpperCase().indexOf(filter) > -1){
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
