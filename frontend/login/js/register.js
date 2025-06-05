export const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
export const passwordRegex = /^.{4,16}$/;
const userNameRegex = /^[a-zA-Z0-9_-]{4,16}$/;

export const estadoValidacionCampos = {
    userName: false,
    userEmail: false,
    userPassword: false,
};

const formRegister = document.querySelector(".form-register");
const inputUser = document.querySelector(".form-register input[name='userName']");
const inputEmail = document.querySelector(".form-register input[name='userEmail']");
const inputPass = document.querySelector(".form-register input[name='userPassword']");
const alertaError = document.querySelector(".form-register .alerta-error");
const alertaExito = document.querySelector(".form-register .alerta-exito");


document.addEventListener("DOMContentLoaded", () => {
    formRegister.addEventListener("submit", (e) => {
        e.preventDefault();

        if (estadoValidacionCampos.userName && estadoValidacionCampos.userEmail && estadoValidacionCampos.userPassword) {
            enviarFormulario(formRegister, alertaError, alertaExito);
        } else {
            alertaError.textContent = "Por favor, completa todos los campos correctamente.";
            alertaError.classList.add("alertaError");
            alertaError.style.display = "block";
            setTimeout(() => {
                alertaError.classList.remove("alertaError");
                alertaError.style.display = "none";
            }, 3000);
        }
    });

    inputUser.addEventListener("input", () => {
        validarCampo(userNameRegex, inputUser, "El usuario debe tener de 4 a 16 caracteres, solo letras, números, guiones y guiones bajos.");
    });

    inputEmail.addEventListener("input", () => {
        validarCampo(emailRegex, inputEmail, "El correo no es válido.");
    });

    inputPass.addEventListener("input", () => {
        validarCampo(passwordRegex, inputPass, "La contraseña debe tener entre 4 y 12 caracteres.");
    });
});
export function validarCampo(regex, input, mensaje) {
    const form = input.closest("form");
    const isRegisterForm = form.classList.contains("form-register");
    const isValid = regex.test(input.value.trim());
    estadoValidacionCampos[input.name] = isValid;

    if (!isRegisterForm) return;

    const container = input.closest("div");
    let mensajeError = container.querySelector(".mensaje-error");

    if (!mensajeError) {
        mensajeError = document.createElement("p");
        mensajeError.classList.add("mensaje-error");
        container.appendChild(mensajeError);
    }

    mensajeError.textContent = isValid ? "" : mensaje;
    mensajeError.style.display = isValid ? "none" : "block";
}

//validar_Campos
export function enviarFormulario(form, alertaError, alertaExito) {
    const userName = form.userName.value.trim();
    const userEmail = form.userEmail.value.trim();
    const userPassword = form.userPassword.value.trim();
    const submitButton = form.querySelector("button[type='submit']");
    submitButton.disabled = true;

    fetch("/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, userEmail, userPassword })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alertaExito.textContent = "Te registraste correctamente";
            alertaExito.classList.add("alertaExito");
            alertaExito.style.display = "block";

            alertaError.classList.remove("alertaError");
            alertaError.style.display = "none";

            form.reset();

            estadoValidacionCampos.userName = false;
            estadoValidacionCampos.userEmail = false;
            estadoValidacionCampos.userPassword = false;
            window.location.href = "login.html";
            setTimeout(() => {
                alertaExito.classList.remove("alertaExito");
                alertaExito.style.display = "none";
            }, 3000);
        } else {
            mostrarError(data.message || "Error al registrarse");
        }
    })
    .catch(() => {
        mostrarError("Error de red al intentar registrarse");
    });

    function mostrarError(msg) {
        alertaError.textContent = msg;
        alertaError.classList.add("alertaError");
        alertaError.style.display = "block";
        setTimeout(() => {
            alertaError.classList.remove("alertaError");
            alertaError.style.display = "none";
        }, 3000);
    }
}

document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("passwordInput");
  const toggleBtn = document.getElementById("togglePassword");

  if (passwordInput && toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";

      toggleBtn.classList.toggle("bx-show");
      toggleBtn.classList.toggle("bx-hide");
    });
  }
});
//prueba de commits


