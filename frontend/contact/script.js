function ocultar_buscador(){
    bars_search.style.top="-10rem";
    cover_ctn_search.style.display="none";
    inputSearch.value="";
    inputSearch.value ="";
    box_search.style.display="none";
}

function mostrar_buscador(){
    bars_search.style.top="5rem";
    cover_ctn_search.style.display="block";
    inputSearch.focus();

    if (inputSearch.value === ""){
        box_search.style.display ="none";
    }
}

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