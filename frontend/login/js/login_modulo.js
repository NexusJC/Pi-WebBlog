import {
    validarCampo,
    emailRegex,
    passwordRegex,
    estadoValidacionCampos
} from "./register.js";
const API_BASE_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:3001"
  : "https://www.ecolima.blog";

const formLogin = document.querySelector(".form-login");
const inputEmail = formLogin.querySelector("input[name='userEmail']");
const inputPass = formLogin.querySelector("input[name='userPassword']");
const alertaErrorLogin = formLogin.querySelector(".alerta-error");
const alertaExitoLogin = formLogin.querySelector(".alerta-exito");
const loader = document.getElementById("loader");
const submitButton = formLogin.querySelector("input[type='submit']");

// ver y ocultar contraseña
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

    inputEmail.addEventListener("input", () => {
        validarCampo(emailRegex, inputEmail, "El correo no es válido.");
    });

    inputPass.addEventListener("input", () => {
        validarCampo(passwordRegex, inputPass, "La contraseña debe tener entre 4 y 16 caracteres.");
    });

    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();

        validarCampo(emailRegex, inputEmail, "El correo no es válido.");
        validarCampo(passwordRegex, inputPass, "La contraseña debe tener entre 4 y 16 caracteres.");

        if (estadoValidacionCampos.userEmail && estadoValidacionCampos.userPassword) {
            submitButton.disabled = true;
            const originalText = submitButton.value;
            submitButton.value = "Iniciando...";
            loader.classList.remove("hide");

            fetch(`${API_BASE_URL}/login`, {
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

                    alertaExitoLogin.textContent = "Inicio de sesión exitoso";
                    alertaExitoLogin.classList.add("alertaExito");
                    alertaExitoLogin.style.display = "block";

                    setTimeout(() => {
                        location.href = "../menu/index.html";
                    }, 1000);
                } else {
                    mostrarMensajeError("Correo o contraseña incorrectos");
                }
            })
            .catch(() => {
                loader.classList.add("hide");
                mostrarMensajeError("Error al iniciar sesión");
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.value = "Iniciar Sesión";
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
