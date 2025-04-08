import { validarCampo, emailRegex, passwordRegex, estadoValidacionCampos, enviarFormulario } from "./register.js";

const formLogin = document.querySelector(".form-login");
const inputEmail = document.querySelector(".form-login input[type='email']");
const inputPass = document.querySelector(".form-login input[type='password']");
const alertaErrorLogin = document.querySelector(".form-login .alerta-error");
const alertaExitoLogin = document.querySelector(".form-login .alerta-exito");

document.addEventListener("DOMContentLoaded", () => {
    // Escuchar envío del formulario
    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();

        validarCampo(emailRegex, inputEmail, "El correo solo puede contener letras, números, puntos, guiones y guion bajo.");
        validarCampo(passwordRegex, inputPass, "La contraseña tiene que ser de 4 a 12 dígitos.");

        if (estadoValidacionCampos.userEmail && estadoValidacionCampos.userPassword) {
            const email = inputEmail.value.trim();
            const password = inputPass.value.trim();

            // Enviar datos al backend
            fetch("http://localhost:3001/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem("userName", data.name);
                localStorage.setItem("userRole", data.role);

                    alertaExitoLogin.textContent = "Inicio de sesión exitoso";
                    alertaExitoLogin.classList.add("alertaExito");

                    setTimeout(() => {
                        location.href = "../menú/index.html";
                    }, 1500);
                } else {
                    alertaErrorLogin.textContent = data.message || "Correo o contraseña incorrectos";
                    alertaErrorLogin.classList.add("alertaError");
                    setTimeout(() => alertaErrorLogin.classList.remove("alertaError"), 3000);
                }
            })
            .catch(error => {
                console.error("Error en el login:", error);
                alertaErrorLogin.textContent = "Hubo un error al intentar iniciar sesión.";
                alertaErrorLogin.classList.add("alertaError");
                setTimeout(() => alertaErrorLogin.classList.remove("alertaError"), 3000);
            });
        } else {
            alertaErrorLogin.textContent = "Por favor, completa todos los campos correctamente.";
            alertaErrorLogin.classList.add("alertaError");
            setTimeout(() => alertaErrorLogin.classList.remove("alertaError"), 3000);
        }
    });

    // Validación en tiempo real
    inputEmail.addEventListener("input", () => {
        validarCampo(emailRegex, inputEmail, "El correo solo puede contener letras, números, puntos, guiones y guion bajo.");
    });

    inputPass.addEventListener("input", () => {
        validarCampo(passwordRegex, inputPass, "La contraseña tiene que ser de 4 a 12 dígitos.");
    });
});
