document.addEventListener("DOMContentLoaded", () => {
    const role = localStorage.getItem("userRole") || "invitado";
    const name = localStorage.getItem("userName") || "Invitado";
    const menu = document.getElementById("dynamic-menu");

    const menuItems = {
        logo: `
            <li>
                <div class="header-content__logo-container">
                    <img src="/img/logo-ecolima.png" alt="Logo">
                </div>
            </li>
        `,
        home: `<li title="Inicio"><a href="/menu/index.html"><i class="fa-solid fa-house"></i></a></li>`,
        about: `<li title="¿Quiénes somos?"><a href="/about-us/aboutUs.html"><i class="fa-solid fa-people-group"></i></a></li>`,
        contact: `<li title="¡Contáctanos!"><a href="/contact/contact.html"><i class="fa-solid fa-envelope"></i></a></li>`,
        publish: `<li title="Publicar"><a href="/publicaciones/publicaciones.html"><i class="fa-solid fa-file-pen"></i></a></li>`,
        admin: `<li title="Administración"><a href="/admin/panel-de-administracion.html"><i class="fa-solid fa-user-gear"></i></a></li>`,
        login: `<li title="Iniciar sesión"><a href="/login/login.html"><i class="fa-solid fa-circle-user"></i></a></li>`,
        logout: `<li title="Cerrar sesión"><a href="#" onclick="cerrarSesion()"><i class="fa-solid fa-right-from-bracket"></i></a></li>`,
        userName: `<li><button class="user-button"><i class="fa-solid fa-user"></i> ${name}</button></li>`,
        search: `<li title="Busquedas"><a href="#" id="icon-search"><i class="fa-solid fa-magnifying-glass"></i></a></li>`
    };

    if (menu) {
        if (role === "admin") {
            menu.innerHTML = `
                ${menuItems.logo}
                ${menuItems.home}
                ${menuItems.about}
                ${menuItems.contact}
                ${menuItems.publish}
                ${menuItems.admin}
                ${menuItems.userName}
                ${menuItems.logout}
                ${menuItems.search}
            `;
        } else if (role === "usuario") {
            menu.innerHTML = `
                ${menuItems.logo}
                ${menuItems.home}
                ${menuItems.about}
                ${menuItems.contact}
                ${menuItems.userName}
                ${menuItems.logout}
                ${menuItems.search}
            `;
        } else {
            menu.innerHTML = `
                ${menuItems.logo}
                ${menuItems.home}
                ${menuItems.about}
                ${menuItems.contact}
                ${menuItems.login}
                ${menuItems.search}
            `;
        }
    }
});

function cerrarSesion() {
    localStorage.clear();
    location.href = "/menu/index.html";
}
document.addEventListener("DOMContentLoaded", () => {
    const currentPath = window.location.pathname;
    const showSearchOnlyOn = ["/menu/index.html"];

    const searchItem = document.querySelector('.search-item');
    if (searchItem && !showSearchOnlyOn.includes(currentPath)) {
        searchItem.style.display = "none";
    }
});

