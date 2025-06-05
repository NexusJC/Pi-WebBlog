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
// Ocultar el icono de menú solo en la página aboutUs.html
// ... (resto de tu código en script.js) ...

// Ocultar el icono de menú solo en la página aboutUs.html
document.addEventListener("DOMContentLoaded", function() {
    const currentPath = window.location.pathname;
    // Debes ajustar esta ruta exactamente a como aparece en el navegador
    // Por ejemplo: "/about-us/aboutUs.html" o "/tu-proyecto/about-us/aboutUs.html"
    console.log("Ruta actual:", currentPath); // Ayuda para depurar
    if (currentPath.includes("../about-us/aboutUs.html") || currentPath.includes("/aboutUs.html")) { // Intenta con ambas posibilidades de ruta
        const iconMenu = document.getElementById("icon-menu");
        if (iconMenu) {
            iconMenu.style.display = "none";
            console.log("Icono de menú ocultado en aboutUs.html"); // Confirma que se ejecutó
        }
    }
});