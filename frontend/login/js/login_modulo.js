import {
    validarCampo,
    emailRegex,
    passwordRegex,
    estadoValidacionCampos
} from "./register.js";

const formLogin = document.querySelector(".form-login");
const inputEmail = formLogin.querySelector("input[name='userEmail']");
const inputPass = formLogin.querySelector("input[name='userPassword']");
const alertaErrorLogin = formLogin.querySelector(".alerta-error");
const alertaExitoLogin = formLogin.querySelector(".alerta-exito");
const loader = document.getElementById("loader");

// Mostrar/ocultar contraseña
const togglePassword = document.getElementById("toggleLoginPassword");
const passwordInput = document.getElementById("loginPasswordInput");

if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", () => {
        const isPassword = passwordInput.type === "password";
        passwordInput.type = isPassword ? "text" : "password";
        togglePassword.className = isPassword ? 'bx bx-hide toggle-password' : 'bx bx-show toggle-password';
    });
}

document.addEventListener("DOMContentLoaded", () => {
    alertaErrorLogin.style.display = "none";
    alertaExitoLogin.style.display = "none";
    loader.classList.add("hide");

    // Validación en tiempo real
    inputEmail.addEventListener("input", () => {
        validarCampo(emailRegex, inputEmail, "El correo no es válido.");
    });

    inputPass.addEventListener("input", () => {
        validarCampo(passwordRegex, inputPass, "La contraseña debe tener entre 4 y 16 caracteres.");
    });

    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();  // ✅ Previene el envío por navegador

        validarCampo(emailRegex, inputEmail, "El correo no es válido.");
        validarCampo(passwordRegex, inputPass, "La contraseña debe tener entre 4 y 16 caracteres.");

        if (estadoValidacionCampos.userEmail && estadoValidacionCampos.userPassword) {
            loader.classList.remove("hide");

            fetch("http://localhost:3001/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: inputEmail.value.trim(),
                    password: inputPass.value.trim(),
                }),
            })
            .then(res => res.json())
            .then(data => {
                loader.classList.add("hide");

                if (data.success) {
                    localStorage.setItem("userId", data.userId);
                    localStorage.setItem("userName", data.name);
                    localStorage.setItem("userRole", data.role);
                    location.href = "../menu/index.html";
                } else {
                    mostrarMensajeError("Correo o contraseña incorrectos");
                }
            })
            .catch(() => {
                loader.classList.add("hide");
                mostrarMensajeError("Error al iniciar sesión");
            });
        } else {
            mostrarMensajeError("Por favor, completa todos los campos correctamente.");
        }
    });
});

function mostrarMensajeError(msg) {
    alertaErrorLogin.textContent = msg;
    alertaErrorLogin.classList.add("alertaError");
    alertaErrorLogin.style.display = "block";

    setTimeout(() => {
        ocultarMensajeError();
    }, 3000);
}

function ocultarMensajeError() {
    alertaErrorLogin.style.display = "none";
    alertaErrorLogin.classList.remove("alertaError");
    alertaErrorLogin.textContent = "";
}
