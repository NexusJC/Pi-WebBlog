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
document.addEventListener("DOMContentLoaded", () => {
document.addEventListener("click", (e) => {
  const modal = document.getElementById("logoutModal");

  // Abrir el modal si se hace clic en el botón de cerrar sesión
  const abrirModalBtn = e.target.closest("#abrirLogoutModal");
  if (abrirModalBtn && modal) {
    e.preventDefault();
    modal.classList.add("show");
    return;
  }

  // Confirmar cierre de sesión
  if (e.target.id === "confirmLogout") {
    localStorage.clear();
    location.href = "/menu/index.html";
    return;
  }

  // Cancelar cierre de sesión
  if (e.target.id === "cancelLogout" || e.target === modal) {
    modal.classList.remove("show");
    return;
  }
});


  const modal = document.getElementById("logoutModal");
  const confirmBtn = document.getElementById("confirmLogout");
  const cancelBtn = document.getElementById("cancelLogout");

  if (abrirModalBtn && modal) {
    abrirModalBtn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.add("show");
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      localStorage.clear();
      location.href = "/login/login.html";
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      modal.classList.remove("show");
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
    }
  });
});