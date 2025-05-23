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
        userName: `<li class="usuario-info"><i class="fa-solid fa-user"></i> ${name}</li>`
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
    location.href = "/menu/index.html"; // O la ruta real donde ves el contenido como visitante
}

