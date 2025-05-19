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
// Función para ocultar el menú lateral al hacer clic fuera de él

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const postForm = document.getElementById('postForm');
    const fileInput = document.getElementById('real-input');
    const mensajeAutorInput = document.getElementById('mensaje-autor');
    const fileNameElement = document.querySelector('.file-name');
    const imgAutorBtn = document.querySelector('.img-autor');
    let userId = 1;

    
    let isSubmitting = false;
    let permitirPublicar = false; 



    const previewStyles = `
/* estilo mínimo como ejemplo */
body {
    margin: 0;
    font-family: sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    justify-content: center;
    background-color: #E0E8E0; 
    margin: 0 !important;
    padding: 0 !important;
    overflow-x: hidden; /* Previene scroll horizontal */
}

div, body, header, nav, ul, footer {
    box-sizing: border-box;
}

.main-wrapper, header, footer {
    width: 100%;
}

h1, h2, h3, h4 {
    text-wrap: balance;
}

h1 {
    font-size: 3.8rem;
    font-weight: 800;
    color: #ffffff;
    text-align: center;
    position: relative;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 3rem 0;
    padding: 1rem 2rem;
    text-shadow:
        0 -10px 20px rgba(255, 255, 255, 0.25), /* leve luz superior */
        0 4px 12px rgba(0, 0, 0, 0.5); /* sombra inferior */
    animation: floatIn 1.2s ease-out forwards;
    opacity: 0;
}

/* Franja blanca difusa por debajo */
h1::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 50rem; /* ← Aquí puedes poner el tamaño que quieras */
    height: 8px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 80%);
    filter: blur(6px);
    border-radius: 50%;
    opacity: 0;
    animation: glowFade 1.2s ease-out 0.6s forwards;
}


/* Animación del texto */
@keyframes floatIn {
    0% {
        transform: translateY(-40px);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

/* Animación de la franja */
@keyframes glowFade {
    to {
        opacity: 1;
        transform: translateX(-50%) scale(1.1);
    }
}

h2 {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    color: transparent;
    background: linear-gradient(90deg, #2e7d32, #66bb6a);
    background-clip: text;
    -webkit-background-clip: text;
    text-transform: uppercase;
    position: relative;
    margin: 3rem 0 1.5rem;
    animation: fadeInUp 0.8s ease-out forwards;
    opacity: 0;
    letter-spacing: 1.2px;
}

/* Animación de entrada */
@keyframes fadeInUp {
    0% {
        transform: translateY(20px);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

/* Animación del subrayado */
@keyframes underlineGrow {
    to {
        width: 28rem;
    }
}



h3 {
    font-size: 1.4rem;
    color: #2e7d32;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    text-transform: capitalize;
    border-left: 6px solid #a5d6a7;
    padding-left: 1rem;
    transition: all 0.3s ease;
}

h3:hover {
    color: #1b5e20;
    border-left-color: #66bb6a;
}

/* H4 - Para subtítulos importantes */
h4 {
    font-size: 1.25rem;
    color: #388e3c;
    font-weight: 600;
    text-transform: uppercase;
    margin: 1.5rem 0 0.5rem;
    border-left: 4px solid #a5d6a7;
    padding-left: 1rem;
    letter-spacing: 1px;
}

/* H5 - Para secciones secundarias o notas */
h5 {
    font-size: 1.1rem;
    color: #4caf50;
    font-weight: 500;
    margin: 1.2rem 0 0.5rem;
    padding-left: 0.5rem;
    border-left: 3px dashed #c8e6c9;
    text-transform: capitalize;
}

/* H6 - Para aclaraciones, detalles o mini títulos */
h6 {
    font-size: 1rem;
    color: #66bb6a;
    font-weight: 400;
    font-style: italic;
    margin: 1rem 0 0.5rem;
    text-align: left;
    letter-spacing: 0.5px;
}

p {
    /* Propiedades compatibles con todos los navegadores */
    hyphens: auto;
    word-wrap: break-word;

    
    
    /* Nueva propiedad con prefijo para Chrome/Edge */
    text-wrap: pretty; 
    
    /* Alternativa para Firefox */
    @supports not (text-wrap: pretty) {
        text-align: justify;
    }
}

a {
    text-decoration: none;
}

.main-wrapper__center-content h2 {
    margin: 4rem 2rem 2rem 2rem; 
}

/* HEADER */


.header {
    background-color: #003800;
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: 0 .5rem 2.5rem #000;
    position: sticky;
    
}

.header-content__logo-container {
    width: 6.1rem;
    height: 5rem;
    display: flex;
    position: relative;
    justify-content: center;
    padding: 0;
    margin: 0
}

.header-content__logo-container img {
    width: 100%;
    height: auto;
    margin: 0;
}

.main-navbar ul {
    display: flex;
    padding: 0;
    justify-content: start;
    margin: 0;
    align-items: center;
    /* justify-content:space-evenly; checar esta entre todos*/
}

.main-navbar ul li:first-child {
    margin-left: 5rem;
    margin-right: 18rem;
}


.main-navbar li {
    list-style: none;
    margin: 0.25rem .95rem;
    position: relative;
    margin-right: 4rem;
}

.main-navbar li:hover a{
    color: #6B8E23; 
}

.main-navbar a {
    color: #e5dede;
    display: inline-block;
    padding: 0.375rem 0.5625rem;
    transition: color 300ms;
    font-size: 1.1rem;
}

nav a {
    text-decoration: none;
}

.main-navbar  .blog-selected {
    color: #6B8E23;
}

.blog-selected::before{
    content: '';
    width: 100%;
    height: .25rem;
    background-color: #54b324;
    position: absolute;
    top: -1.27rem;
    left: 0;
}

.menu nav ul li a i {
    display: inline;
    font-size: 1.8rem;
}

#icon-search {
font-size: 1.75rem;
}

#icon-menu {
    width: 2.75rem;
    height: 2.75rem;
    position: fixed;
    right: 2rem;
    top: .85rem;
    color: #e5dede;
    background-color: #388E3C;
    border-radius: 100%;
    justify-content:center;
    align-items: center;
    display: none;
    cursor: pointer;
    padding: 1rem;

}

#icon-menu:hover {
    background-color: #2E7D32;
}

/* BUSQUEDAS SECTION */

.main-navbar i {
    color: #e5dede;
}

.main-navbar--ctn-icon-search {
    margin-top: 0rem;
    margin-left: 5rem;
    cursor: pointer;

}

#ctn-icon-search {
    position: absolute;
    right: 2rem;
    height: 6rem;
    display: flex;
    justify-content: center;
    
}

#ctn-icon-search i {
    font-size: 2rem;
    cursor: pointer;
    transition: all 300ms;
}

#ctn-bars-search {
    position: fixed;
    top: -10rem;
    width: 64rem;
    background-color: #fff;
    padding: 2rem;
    z-index: 9;
    transition: all 600ms;
}

#ctn-bars-search input {
    display: block;
    width: 50rem;
    margin: auto;
    padding: .5rem;
    font-size: .7rem;
    outline: 0;
}

#box-search {
    position: fixed;
    top: 10rem;
    list-style: none;
    width: 64rem;
    background-color: #fff;
    z-index: 8;
    overflow: hidden;
    padding-bottom: 1rem;
    display: none;
    
}

#box-search li a {
    display: block;
    width: 64rem;
    color: #777777;
    padding: .8rem 2rem;
}

#box-search li a:hover {
    background: #f3f3f3;
}

#box-search li a i {
    margin-right: 2rem;
    color: #777777;
}

#cover-ctn-search {
    width: 100%;
    height: 100vh;
    position: fixed;
    left: 0; 
    background: rgba(0, 0, 0, 0.5);
    z-index: 7;
    top: 0;
    display: none;
}

#cover-ctn-search {
    width: 100%;
    height: 100vh;
    position: fixed;
    left: 0; 
    background: rgba(0, 0, 0, 0.5);
    z-index: 7;
    top: 0;
    display: none;
}

/* PORTADA */

.main-wrapper__container-cover {
    width: 100%;
    height: 30rem;
    position: relative;
    top: 0rem;
    background-image: url("../img/background-cover.jpg");
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
}

.main-wrapper__container-cover::before {
    content: '';
    width: 100%;
    height: 100%;
    background: rgba(3, 21, 3, 0.6); 
    position: absolute;
    top: 0;
    left: 0;
    z-index: 5;
}

.main-wrapper__center-content {
    display: flex;
    flex-direction: column;
}

.container-cover--container-info-cover {
    max-width: 60rem;
    height: 30rem;
    margin: auto;
    text-align: center;
    justify-content: center;
    align-content: center;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 6;
    color: #fff;
}

.container-cover--container-info-cover h1, .container-cover--container-info-cover p {
    color: #fff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
}

.container-cover--container-info-cover h1 {
    font-size: 3rem;
    font-weight: 500;
    margin-bottom: 2rem;
}

.container-cover--container-info-cover p {
    font-size: 1.2rem;
    font-weight: 300;
}

.secondary-navbar--contenedor {
    text-align: start;
}

/* MAIN SECTION */

.main-wrapper {
    min-width: 64rem;
    padding: 0 0.625rem;
    display: flex;
    flex-grow: 1;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.625rem;
}

aside, main {
    padding: 0.625rem 1.25rem;
    flex-basis: 0;
    background-color: #E8F0E8 ;
}

main {
    min-width: 15.75rem;
    flex-grow: 2;
    padding: 0;
}


/* Centrar el contenedor principal */
.container-post {
    display: flex; /* Activar flexbox */
    justify-content: center; /* Centrar horizontalmente */
    align-items: center; /* Centrar verticalmente */
    flex-direction: column; /* Asegurar que los elementos estén en columna */
    margin: 0 auto; /* Centrar el contenedor en la página */
    padding: 100px; /* Espaciado interno */
    max-width: 650px; /* Limitar el ancho del contenedor */
    text-align: center; /* Centrar el texto */
    position: relative; /* Posicionar elementos hijos absolutamente */
    overflow: hidden; /* Evitar que el contenido se desborde */
    padding: 20px; /* Espaciado interno */
}

/* Contenedor de los posts con desplazamiento infinito */
.posts {
    display: flex; /* Activar Flexbox */
    flex-wrap: nowrap; /* Evitar que los posts se envuelvan a la siguiente línea */
    gap: 10px; /* Espaciado entre los posts */
    overflow-x: auto; /* Habilitar desplazamiento horizontal */
    padding: 20px; /* Espaciado interno */
    width: 100%; /* Asegurar que ocupe todo el ancho */
    box-sizing: border-box; /* Incluir padding en el ancho total */
    scroll-snap-type: x mandatory; /* Activar desplazamiento suave horizontal */
}

/* Estilo para los posts individuales */
.post {
    flex: 0 0 auto; /* Asegurar que los posts no se reduzcan y mantengan su tamaño */
    width: 300px; /* Ancho fijo para cada post */
    background: #fff; /* Fondo blanco */
    border-radius: 8px; /* Bordes redondeados */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombra para destacar */
    overflow: hidden; /* Evitar que el contenido se desborde */
    display: flex;
    flex-direction: column; /* Asegurar que los elementos estén en columna */
    justify-content: space-between; /* Distribuir espacio entre los elementos */
    align-items: center; /* Centrar contenido horizontalmente */
    padding: 50px; /* Espaciado interno */
    scroll-snap-align: start; /* Alinear cada post al inicio del contenedor */
}

/* Imagen dentro del post */
.ctn-img img {
    width: 100%; /* Asegurar que la imagen ocupe todo el ancho del post */
    height: 200px; /* Altura fija para la imagen */
    object-fit: cover; /* Asegurar que la imagen cubra el área sin distorsionarse */
    border-bottom: 1px solid #ddd; /* Línea separadora debajo de la imagen */
    margin-bottom: 10px; /* Espaciado inferior */
    border-radius: 8px; /* Bordes redondeados */
}

/* Título del post */
.post h2 {
    font-size: 1.2rem; /* Tamaño del texto */
    margin: 10px 0; /* Espaciado superior e inferior */
    text-align: center; /* Centrar texto */
}

/* Texto del span */
.post span {
    font-size: 0.9rem; /* Tamaño más pequeño */
    color: #555; /* Color gris */
    margin-bottom: 10px; /* Espaciado inferior */
}
/* Centrar el botón dentro del post */
.post button {
    margin: 10px auto; /* Centrar el botón horizontalmente */
    display: block; /* Asegurar que el botón sea tratado como un bloque */
    padding: 10px 20px; /* Espaciado interno del botón */
    background-color: #007BFF; /* Color de fondo */
    color: white; /* Color del texto */
    border: none; /* Sin bordes */
    border-radius: 5px; /* Bordes redondeados */
    cursor: pointer; /* Cambiar el cursor al pasar sobre el botón */
}

.post button:hover {
    background-color: #0056b3; /* Cambiar color al pasar el mouse */
}

.container-post + h2, .container-post h2 {
    font-size: 2rem;
    color: #388E3C; /* Verde oscuro */
    font-weight: 600;
    text-align: center;
    margin-bottom: 20px;
    border-bottom: 2px solid #A5D6A7; /* Línea decorativa */
    padding-bottom: 10px;
}

.post h2 {
    font-size: 18px; 
    margin-bottom: 20px;
    padding: 0 20px;
}

.post span {
    font-size: 0.8rem; /* Ajusta el tamaño del texto */
    color: #555; /* Cambia el color si es necesario */
    display: block; /* Asegura que se mantenga en bloque */
    margin-top: 10px; /* Espaciado superior */
    padding: 0 20px; /* Espaciado interno opcional */
}

.ctn-tags {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin-left: 16px;
    margin-top: 10px;
}

.ctn-tags li {
    list-style: none;
    font-size: 14px;
    margin: 4px;
    padding: 4px 10px;
    background: #686868;
    cursor: default;
}

.referencias {
    margin-top: 30px;
    padding: 15px;
    background-color: #f5f5f5;
    border-left: 4px solid #4CAF50;
}

.referencias h3 {
    margin-bottom: 10px;
    color: #333;
}

.referencias div {
    font-size: 16px;
    line-height: 1.6;
}

/*
.main-wrapper__contenido-relacionado {
    flex-grow: .8;
    min-width: 10rem;
}*/
/* Contenedor principal que incluye el contenido y el aside */
.main-content {
    display: flex; /* Activar Flexbox */
    justify-content: space-between; /* Espaciado entre el contenido principal y el aside */
    align-items: flex-start; /* Alinear los elementos al inicio verticalmente */
    gap: 20px; /* Espaciado entre el contenido principal y el aside */
    margin: 20px auto; /* Centrar el contenedor */
    max-width: 1200px; /* Limitar el ancho máximo */
    padding: 20px; /* Espaciado interno */
    box-sizing: border-box; /* Incluir padding en el ancho total */
}

/* Estilo para el contenido principal */
main {
    flex: 3; /* Ocupa más espacio que el aside */
    background-color: #f9f9f9; /* Fondo opcional */
    padding: 100px; /* Espaciado interno */
    border-radius: 8px; /* Bordes redondeados */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombra opcional */
}

/* Estilo para el aside */
.main-wrapper__contenido-relacionado {
    flex: 1; /* Ocupa menos espacio que el contenido principal */
    background-color: #fff; /* Fondo blanco */
    padding: 20px; /* Espaciado interno */
    border-radius: 8px; /* Bordes redondeados */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombra opcional */
    max-width: 300px; /* Limitar el ancho del aside */
    display: flex; /* Activar Flexbox */
    flex-direction: column; /* Alinear los elementos en columna */
    overflow: hidden; /* Evitar que el contenido se desborde */
    position: relative; /* Posicionar elementos hijos absolutamente */
    align-items: center; /* Centrar contenido horizontalmente */
}

/* Contenedor del carrusel */
.related-items-container {
    display: flex;
    flex-direction: column; /* Asegura que los elementos estén en columna */
    overflow-y: auto; /* Habilita el desplazamiento vertical */
    scroll-snap-type: y mandatory; /* Activa el desplazamiento suave */
    height: 36rem; /* Altura fija del contenedor */
    gap: 10px; /* Espaciado entre los elementos */
    background-color: #f5f5f5; /* Fondo claro para destacar los elementos */
    border-radius: 8px; /* Bordes redondeados */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombra para darle profundidad */
}

/* Estilo para cada elemento relacionado */
.related-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 50px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
    margin-bottom: 10px;
    width: 100%; /* Asegura que ocupe todo el ancho */
    box-sizing: border-box;
    background-color: #ffffff; /* Fondo blanco */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra ligera */
    transition: transform 0.3s ease, box-shadow 0.3s ease; /* Transición para hover */
}

/* Efecto hover para los elementos relacionados */
.related-item:hover {
    transform: scale(1.05); /* Aumenta ligeramente el tamaño */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombra más intensa */
}

/* Títulos dentro de los elementos relacionados */
.related-item h4 {
    font-size: 1.2rem; /* Tamaño del texto */
    color: #333; /* Color del texto */
    margin-bottom: 5px; /* Espaciado inferior */
}

/* Texto descriptivo dentro de los elementos relacionados */
.related-item p {
    font-size: 0.9rem; /* Tamaño del texto */
    color: #666; /* Color gris */
    margin-bottom: 10px; /* Espaciado inferior */
}


/* Botones de navegación */
.carousel-button {
    position: absolute;
    width: 30px;
    height: 30px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 10;
}

.carousel-button:hover {
    background-color: #0056b3;
}

/* Opcional: Ajusta el tamaño de las imágenes */
.related-item img {
    max-width: 150px; /* Ajusta el tamaño máximo de la imagen */
    margin-bottom: 10px;
}

/* Opcional: Estilo para el botón */
.related-item button {
    margin-top: 10px;
    padding: 10px 50px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-family: 'Arial', sans-serif; /* Cambia la fuente */
    font-size: 1rem; /* Ajusta el tamaño del texto */
    font-weight: bold; /* Hace el texto más grueso */
    text-transform: uppercase; /* Convierte el texto a mayúsculas */
    letter-spacing: 1px; /* Espaciado entre letras */
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3); /* Sombra en el texto */
}

.related-item button:hover {
    background-color: #0056b3;
}

/* Ocultar la barra de desplazamiento vertical */
.related-items-container {
    scrollbar-width: none; /* Ocultar barra en Firefox */
    -ms-overflow-style: none; /* Ocultar barra en Internet Explorer y Edge */
}

.related-items-container::-webkit-scrollbar {
    display: none; /* Ocultar barra en Chrome, Safari y Edge */
}



/* Estilo para el contenedor de los elementos relacionados */
.posts {
    scrollbar-width: none; /* Ocultar barra de desplazamiento en Firefox */
}

.posts::-webkit-scrollbar {
    display: none; /* Ocultar barra de desplazamiento en Chrome, Edge y Safari */
}
/* Flecha izquierda */
.left-arrow {
    left: 5px; /* Ajusta este valor para separarla más a la izquierda */
}

/* Flecha derecha */
.right-arrow {
    right: 5px; /* Ajusta este valor para separarla más a la derecha */
}

/* Hover en las flechas */
.arrow:hover {
    background-color: #0056b3; /* Cambiar color al pasar el mouse */
    transform: scale(1.1); /* Aumentar tamaño ligeramente */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* Sombra más intensa */
}

/* Icono dentro de las flechas */
.arrow i {
    font-size: 1.5rem; /* Tamaño del icono */
}

.posts {
    display: flex; /* Alinear los posts en fila */
    flex-wrap: nowrap; /* Evitar que los posts se envuelvan */
    overflow: hidden; /* Ocultar el contenido desbordado */
    scroll-behavior: smooth; /* Desplazamiento suave */
}

#carousel-posts .post {
    display: block !important;
    opacity: 1;
}  
.main-wrapper__secondary-navbar {
    flex: 1 1 15%;
    padding: 2rem;
    padding-top: 0;
    max-width: 15rem; /* antes era 1rem */
    min-width: 8rem;   /* opcional: asegúrate de que tenga un mínimo */
    text-align: center;
    background-color: #E8F0E8;
}

.main-wrapper__secondary-navbar ul {
    padding: 0;
}

.main-wrapper__secondary-navbar li {
    list-style: none;
}

.main-wrapper__secondary-navbar a {
    color: #87CEEB; 
    display: inline-block;
    padding: 0.375rem 0.625rem;
}
.main-wrapper__center-content {
    flex: 2 1 55%; 

}

.main-wrapper__contenido-relacionado {
    flex: 1 1 20%;
    padding: 2rem;
    padding-top: 0;

}

.contenido-relacionado-content {
    flex: 1 1 20%; 
    
}

.related-item img {
    width: 20rem;
}

/* FOOTER */

.footer{
    width: 100%;
    background-color:#0a141d ;

}

.footer .footer__grupo1{
    width: 100%;
    max-width: 75rem;
    margin: auto;
    display: grid;
    grid-template-columns: repeat(3,1fr);
    grid-gap: 5rem;
    padding: 4.5rem;
}
.footer .footer__grupo1 .box figure{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.footer .footer__grupo1 .box figure img{
    width: 10rem;

}

.footer .footer__grupo1 .box h2{

    margin-bottom: 2rem;
    font-size: 2rem;
    border-bottom: none;
}

.footer .footer__grupo1 .box p{
    color: #efefef;
    margin-bottom: 1rem;
}

.footer .footer__grupo1 .red-social a{
    display: inline-block;
    text-decoration: none;
    width: 2.5rem;
    height: 2.5rem;
    line-height: 2.5rem;
    color: #fff;
    margin-right: 1rem;
    background-color: #0d2033;
    text-align: center;
    transition: all 300ms ease;
}

.footer .footer__grupo1 .red-social a:hover{
    color:aquamarine;
}

.footer .footer__grupo2{
    background-color: #0a1a2a;
    padding: 1.5rem 1rem;
    text-align: center;
    color: #fff;
}

.footer .footer__grupo2 small{
    font-size: .9rem;
}

/* Importando fuentes */
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital@0;1&display=swap');
@media screen and (max-width: 1220px) {
    /* Header y navbar */
    .header {
        padding: 0 1rem; /* Añadimos padding lateral */
    }
    
    .main-navbar ul {
        flex-wrap: wrap; /* Permite que los items se ajusten */
        justify-content: space-between; /* Distribución uniforme */
        padding: 0; /* Espaciado vertical */
    }
    
    .main-navbar ul li:first-child {
        margin-left: 5rem !important; /* Reducimos margen */
        margin-right: auto !important; /* Empuja otros items a la derecha */
    }
    
    .main-navbar li {
        margin: 0.25rem 0.5rem !important; /* Reducimos márgenes */
    }
    
    /* Ajuste para el icono de búsqueda */
    #ctn-icon-search {
        right: 1rem;
    }
    
    /* Asegurar que el contenedor ocupe el 100% */
    .header-content {
        width: 100%;
        max-width: 100%;
        padding: 0;
    }
    
    /* Ajuste para el logo */
    .header-content__logo-container {
        margin-left: 1rem;
    }

    .main-navbar ul li:first-child {
        margin-left: 5rem;
        margin-right: 1rem !important;
    }

    #icon-search {
        margin-right: 8rem;
    }
    
}


@media screen and (max-width: 1020px) {
    .main-navbar ul li:first-child {
        margin-left: 5rem;
        margin-right: 2rem !important;
    }

    #icon-search {
        margin-left: -3rem!important;
        
    }
    .main-wrapper__center-content {
        width: 100%;
        flex-direction: column;
    }

    article {
        width: 90%;
        /* padding: 3rem; */
        padding-bottom: 5rem;
        border-radius: .5rem;
    }
    .main-navbar {
        width: 100%;
    }

    .main-wrapper__contenido-relacionado {
        transform: translateX(  -5rem);
    }

    .main-wrapper__center-content h2{
        margin-left: -4rem;
    }

    .contenido-relacionado-content {
        display: flex;
        justify-content: center;
    }

    .contenido-relacionado-content aside {
        max-width: 28rem;
        margin: 0rem;
    }
    .main-navbar ul li:first-child {
        margin-left: 5rem;
        margin-right:1rem !important;
    }

    #icon-search {
        margin-left: 0rem ;
    }

    .main-wrapper__secondary-navbar {
        margin-left: 5.5rem;
    }

    article {
        width: 100%;
        padding: 0;
        padding-bottom: 5rem;
        border-radius: .5rem;
        margin: 0;
        transform: translateX(-3.1rem) !important;
    }

}

@media screen and (max-width: 800px) {
    
    .main-navbar {
        flex-direction: column; /* Cambiar la dirección de los elementos en pantallas pequeñas */
        align-items: flex-start; /* Alinea los elementos a la izquierda */
    }

    .main-wrapper__secondary-navbar {
        width: .1rem;
        margin: 0;
        padding: 0;
        /* background-color: #2E7D32;  BUSCAR EL COLOR PARA QUE SEA EL MISMO COLOR DE FONDO Y NO SE NOTE */
    }

    .main-wrapper__contenido-relacionado {
        transform: translateX(3.1rem)!important;
    }

    .cotainer-all {
        transition: all 300ms cubic-bezier(1,0,0,1);
    }

    .move-conainer-all {
        transform: translateX(20rem);

    }

    .post-image:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
}
    .menu {
        width: 20rem;
        height: 100vh;
        position: fixed;
        background-color: #c9c5c5; 
        color: #0a141d; 
        left: 0;
        overflow: hidden;
        transform: translateX(-20rem);
        transition: all 300ms cubic-bezier(1,0,0,1);
    }

    .menu.show-lateral {
        transform: translateX(0);
        box-shadow: 0 .5rem 2.5rem #000;
        z-index: 11;
    }

    .show-lateral {
        width: 20rem;
        transform: translateX(0rem);

    
    }
    
    .menu nav ul{
        flex-direction: column;
    }
    
    .menu nav ul li {
        max-width: 18rem;
        height: 5rem;
        justify-content: flex-start;
    }

    .menu ul:first-child {
        margin-top: -3rem;
    }
    .blog-selected::before {
        width: 0;
    }
    .menu nav ul li a{
        margin-top: 4rem;
        color : #2b2a2a;
    }
    
    .menu nav ul li a i {
        width: 1.3rem;
        display: inline-block;
        margin-right: .7rem;
        color:#0a141d;
    }

    #icon-menu {
        display: flex;
    }

    .main-wrapper__center-content {
        flex-wrap: wrap;
    }

    #icon-search {
        display: flex;
        color:#0a141d;
        margin-top: 4rem;
        margin-right:4.5rem;
    }

    #box-search, #ctn-bars-search, #inputSearch {
        width: 80% !important;
    }


    .header-content__logo-container {    
        display: none;
    }
    
    .main-wrapper__center-content {
        display: flex ;
        flex-direction: column ;
        width: 100% ;
        gap: 1rem; /* Espacio entre elementos */
    }
    
    /* Resetear cualquier propiedad que pueda interferir */
    main,
    .main-wrapper__secondary-navbar,
    .main-wrapper__contenido-relacionado {
        width: 100% ;
        max-width: 100% ;
        flex: 0 0 auto ; /* Evita que crezcan o se encogan */
        order: initial ;
        transform: none ;
        margin: 0 ;
        padding: 1rem ;
        float: none ; /* Por si hay floats */
        position: relative ; /* Resetear posicionamiento */
        left: auto ;
        right: auto ;
    }
    
    article {
        padding: .3rem !important;
        transform: translateX(3.1rem) !important;
    }

    /* Si hay elementos hijos con display inline */
    .main-wrapper__center-content > * {
        display: block ;
    }
    
    /* Orden específico (ajusta según necesites) */
    .main-wrapper__secondary-navbar {
        order: 2 !important;
        transform: translateX(0rem) !important;
    }
    
    main {
        order: 1 !important;
    }
    
    .main-wrapper__contenido-relacionado {
        order: 3 !important ;
    }
    
    /* Contenido relacionado - asegurar apilamiento */
    .contenido-relacionado-content {
        display: flex ;
        flex-direction: column ;
    }
    
    .contenido-relacionado-content aside {
        width: 100% ;
        margin: 0.5rem 0 ;

    }

    .main-wrapper {
        min-width: 100% ; /* Eliminamos el ancho mínimo fijo */
        padding: 0;
        background-color: #E8F0E8; 
    }

    .main-wrapper__center-content {
        display: flex;
        flex-direction: column;
        align-items: center; /* Centramos horizontalmente */
        width: 100%;
        gap: 2rem; /* Espacio entre secciones */
        padding: 1rem; /* Padding general */
    }

    main, 
    .main-wrapper__secondary-navbar,
    .main-wrapper__contenido-relacionado {
        width: 90% ; /* 90% del padre (para dejar margen) */
        max-width: 600px ; /* Máximo para no estirarse mucho */
        margin: 0 auto ; /* Centrado horizontal */
        padding: 1.5rem !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1); /* Sombra suave para mejor visual */
        border-radius: 8px; /* Bordes redondeados */

    }

    /* Contenido relacionado - ajustes específicos */
    .contenido-relacionado-content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        width: 100%;
    }

    .contenido-relacionado-content aside {
        width: 100% ;
        padding: 1.2rem;
    }

    /* Ajustes para el contenido dentro de los artículos */
    article {
        width: 100% ;
        padding: 1.5rem ;
    }

    article p {
        padding: 0 0.5rem ; /* Reducimos el padding interno */
        padding-right: 0 !important; /* Para evitar conflicto con el padding de la clase */
    }

    article img {
        margin: 1.5rem auto; /* Centramos imágenes */
        max-width: 100%;
    }
}

@media screen and (max-width: 800px) {

    .box {
        width: 10rem;
        height: 10rem;
    }
    /* FOOTER RESPONSIVE */
    .footer .footer__grupo1 {
        grid-template-columns: 1fr; /* Cambia a una sola columna */
        grid-gap: 2rem; /* Reduce el espacio entre elementos */
        padding: 2rem 0rem !important; /* Padding más compacto */
    }

    .footer .footer__grupo1 .box {
        text-align: center; /* Centra el contenido */
        margin-bottom: 1.5rem;
    }

    .footer .footer__grupo1 .box figure {
        justify-content: center;
    }

    .footer .footer__grupo1 .box h2 {
        font-size: 1.5rem; /* Reduce tamaño de títulos */
        margin-bottom: 1rem;
    }

    .footer .footer__grupo1 .red-social {
        justify-content: center; /* Centra redes sociales */
        flex-wrap: wrap; /* Permite que se envuelvan */
    }

    .footer .footer__grupo1 .red-social a {
        margin: 0.5rem; /* Espaciado uniforme */
    }

    .footer .footer__grupo2 {
        padding-top: 1rem; /* Padding más compacto */
    }

    .footer-content {
        display: flex;
        flex-direction: column;
        gap: 4rem; /* Espacio uniforme entre elementos */
    }
}

@media screen and (max-width: 600px) {
    /* Elimina las transformaciones que desplazan el contenido */
    .main-wrapper__secondary-navbar, 
    .contenido-relacionado--contenedor {
        transform: none !important;
        transform: translateX(3rem) !important;
    }

    /* Ajustes para el footer */
    .footer .footer__grupo1 {
        display: flex;
        flex-direction: column;
        align-items: center; /* Centra horizontalmente */
        text-align: center; /* Centra el texto */
        margin-left: 0 !important; /* Elimina el margen izquierdo */
        padding: 2rem 1rem !important; /* Ajusta el padding */
    }

    .footer .footer__grupo1 .box {
        width: 100%;
        max-width: 300px; /* Ancho máximo para mejor legibilidad */
        margin-bottom: 2rem;
    }

    .footer .footer__grupo1 .box:first-child {
        display: flex !important; /* Muestra el primer box */
        justify-content: center;
    }

    .footer .footer__grupo1 .box figure img {
        width: 80%; /* Reduce el tamaño del logo */
    }

    .footer .footer__grupo1 .red-social {
        justify-content: center; /* Centra las redes sociales */
    }

    .footer .footer__grupo2 {
        text-align: center;
        padding: 1rem;
    }

    /* Ajustes adicionales para el contenido principal */
    article {
        width: 100% !important;
        padding: 1rem !important;
    }

    .contenido-relacionado--contenedor, 
    .secondary-navbar--contenedor {
        width: 100% !important;
    }

    .main-wrapper__contenido-relacionado {
        transform: translateX(2.75rem);
    }
}

@media screen and (max-width: 415px) {

    .main-wrapper__secondary-navbar, .contenido-relacionado--contenedor {
        transform: translateX(8rem)!important;
    }

    article {
        transform: translate(8rem)!important;
    }
    
}
`;


    document.getElementById('btn-preview').addEventListener('click', () => {
        const mensajeAutor = mensajeAutorInput.value.trim();
        const content = quill.root.innerHTML.trim();
        const title = document.getElementById('post-title').value.trim();
        const referencias = document.getElementById('referencias')?.value.trim() || '';
        const tagsArray = tagify.value.map(tag => tag.value);
        const tags = tagsArray.join(', '); 


        const fecha = new Date().toLocaleDateString();
    
        let imageSrc = '../img/default.jpg';
    
        if (fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                imageSrc = event.target.result;
                renderPreview();
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            renderPreview();
        }
    
        function renderPreview() {
            const previewHTML = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>${previewStyles}</style>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
        <style>
            * { pointer-events: none; } /* 🔒 Desactiva navegación accidental */
        </style>
    </head>
    <body>
        <header class="header">
            <div class="header-content">
                <div class="menu">
                    <nav class="main-navbar">
                        <ul>
                            <li>
                                <div class="header-content__logo-container">
                                    <img src="../../../img/logo-ecolima.png" alt="">
                                </div>
                            </li>
                            <li><a><i class="fa-solid fa-house"></i></a></li>
                            <li class="blog-selected"><a class="blog-selected"><i class="fa-solid fa-newspaper"></i></a></li>
                            <li><a><i class="fa-solid fa-people-group"></i></a></li>
                            <li><a><i class="fa-solid fa-envelope"></i></a></li>
                            <li><a><i class="fa-solid fa-circle-user"></i></a></li>
                            <li><i class="fa-solid fa-magnifying-glass"></i></li>
                        </ul>
                    </nav>  
                </div>
            </div>
        </header>
    
        <main style="padding: 7rem; max-width: 1000px; margin: auto;">
            <h2>${title}</h2>
            <p><strong>Fecha:</strong> ${fecha}</p>
            <p><strong>Mensaje del autor:</strong> ${mensajeAutor}</p>
            <img src="${imageSrc}" style="max-width: 80%; margin: 20px 0;display: block;
            max-width: 80%;
            height: auto;
            margin: 2rem auto; /* centrado vertical y horizontal */
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* sombra suave */
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            " />
            <div>${content}</div>
            <section class="referencias" style="margin-top: 2rem;">
                <h3>Referencias</h3>
                <div>${referencias || 'Ninguna'}</div>
            </section>
            <section style="margin-top: 1rem;">
                <strong>Etiquetas:</strong> ${tags}
            </section>
        </main>
    </body>
    </html>`;
    
            const blob = new Blob([previewHTML], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const iframe = document.getElementById('iframe-preview');
            iframe.src = url;
            document.getElementById('preview-modal').style.display = 'block';
        }
    });
    
    // Inicializar Tagify
    const tagInput = document.getElementById('post-tags');
    const tagify = new Tagify(tagInput, {
        maxTags: 3,
        whitelist: ["naturaleza", "fauna", "flora", "medio ambiente", "biodiversidad", "lagos", "montañas"], // Opcional
        dropdown: {
            enabled: 0 // Sugerencias automáticas
        }
    });

    // Inicializar Quill Editor


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

    const quill = new Quill("#editor", {
        theme: "snow",
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'header': [2, 3, 4, 5, 6, false] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                ['link', 'image'],
                ['video'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }],
                
                ['clean']
            ]
        },
        placeholder: 'Escribe tu contenido aquí...',
        bounds: document.getElementById('editor')
    });

    quill.root.setAttribute("spellcheck", "true");


    document.getElementById('btn-close-preview').addEventListener('click', () => {
        permitirPublicar = false;
        const modal = document.getElementById('preview-modal');
        const iframe = document.getElementById('iframe-preview');
    
        modal.style.display = 'none';
        iframe.src = ''; // ⚠️ Esto limpia el iframe para evitar conflictos
    });
    document.getElementById('btn-confirm-publish').addEventListener('click', () => {
        permitirPublicar = true;
    
        // Puedes cerrar el modal si así se desea:
        const modal = document.getElementById('preview-modal');
        modal.style.display = 'none';
    });

document.querySelector('.btn-post').addEventListener('click', () => {
    let tags = [];
    try {
        tags = tagify.getCleanValue().map(tag => tag.value).filter(t => t && t.trim());
    } catch (err) {
        showAlert("⚠️ Error al procesar las etiquetas.", "error");
        return;
    }

    if (tags.length === 0) {
        showAlert("⚠️ Debes ingresar al menos una etiqueta válida.", "error");
        tagInput.classList.add("shake");
        setTimeout(() => tagInput.classList.remove("shake"), 500);
        return;
    }

    
    if (!fileInput.files || fileInput.files.length === 0) {
        showAlert("⚠️ Debes seleccionar una imagen antes de publicar.", "error");
        fileInput.classList.add("shake");
        setTimeout(() => fileInput.classList.remove("shake"), 500);
        return;
    }

    permitirPublicar = true;
    postForm.requestSubmit();
});

      
    
    
    postForm.addEventListener('submit', async function(e) {
        e.preventDefault();
    
        if (!permitirPublicar) {
            console.warn("🚫 Publicación bloqueada: no se confirmó desde vista previa");
            return;
        }
    
        
        if (isSubmitting) return;
        isSubmitting = true;
    
        const submitBtn = postForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publicando...';
    
        try {
            const title = document.getElementById('post-title').value.trim();
            const mensajeAutor = mensajeAutorInput.value.trim();
            const referencias = document.getElementById('referencias')?.value.trim() || '';
            let tags = [];
try {
    tags = tagify.getCleanValue().map(tag => tag.value).filter(t => t && t.trim());
} catch (err) {
    showAlert("⚠️ Error al parsear las etiquetas:", err);
    tags = [];
}

if (tags.length === 0) {
    console.log("✅ No hay etiquetas, se debe mostrar la alerta");
    showAlert("⚠️ Debes ingresar al menos una etiqueta válida.", "error");

    tagInput.classList.add("shake");
    setTimeout(() => tagInput.classList.remove("shake"), 500);

    return;
}


            const content = quill.root.innerHTML.trim();
            
            const formData = new FormData();
            formData.append('title', title);
            formData.append('mensaje_autor', mensajeAutor);
            formData.append('referencias', referencias);
            formData.append('tags', JSON.stringify(tags));
            formData.append('content', content);
            formData.append('user_id', userId);

            
            if (fileInput.files[0]) {
                formData.append('image', fileInput.files[0]);
            }
            
            const response = await fetch('http://localhost:3001/api/posts', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                showAlert('✅ Publicación exitosa', 'success');
                postForm.reset();
                quill.setContents([]); // limpia el contenido
                document.getElementById('preview')?.remove();
                fileNameElement.textContent = 'No hay imagen seleccionada';
                loadPosts(); // vuelve a cargar los posts
            } else {
                throw new Error(result.message || 'No se pudo publicar');
            }
            
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            showAlert(`❌ ${error.message}`, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            isSubmitting = false;
        }
    });
    
    

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
    const mensajeAutor = document.getElementById('mensaje-autor')?.value.trim();
    const editorContent = document.querySelector('#editor .ql-editor')?.innerHTML.trim();
    const hasFile = document.getElementById('real-input')?.files.length > 0;

    const hasContent = (editorContent && editorContent !== '<p><br></p>') ||
                       (mensajeAutor && mensajeAutor !== '') ||
                       hasFile;

    if (hasContent) {
        e.preventDefault();
        e.returnValue = 'Tienes cambios no guardados. ¿Seguro que quieres salir?';
    }
});
