/*import { validarCampo , emailRegex, passwordRegex , estadoValidocionCampos , enviarformulario } from "./register";
const formLogin = document.querySelector(".form-login");
const inputEmail = document.querySelector(".form-login input[type='email']");
const inputPass = document.querySelector(".form-login input[type='password']");
const alertaErrorLogin = document.querySelector(".form-login .alerta-error");
const alertaExitoLogin = document.querySelector(".form-login .alerta-exito");


document.addEventListener("DOMContentLoaded", () => {
    formLogin.addEventListener("submint", e => {
    estadoValidocionCampos.userName = true;

    e.preventDefault();
    enviarformulario(formLogin,alertaErrorLogin,alertaExitoLogin)
    });

    inputEmail.addEventListener("input", () => {
        validarCampo(emailRegex,inputEmail,"El correo solo puede contener letras, números, puntos, guiones y guíon bajo.")
    })

    inputPass.addEventListener("input", () => {
        validarCampo(passwordRegex, inputPass,"La contraseña tiene que ser de 4 a 12 dígitos.")
    })

})*/

import { validarCampo, emailRegex, passwordRegex, estadoValidacionCampos, enviarFormulario } from "./register.js";

const formLogin = document.querySelector(".form-login");
const inputEmail = document.querySelector(".form-login input[type='email']");
const inputPass = document.querySelector(".form-login input[type='password']");
const alertaErrorLogin = document.querySelector(".form-login .alerta-error");
const alertaExitoLogin = document.querySelector(".form-login .alerta-exito");

document.addEventListener("DOMContentLoaded", () => {
    formLogin.addEventListener("submit", (e) => {
        e.preventDefault(); // Evitar que el formulario se envíe

        // Validar todos los campos antes de continuar
        validarCampo(emailRegex, inputEmail, "El correo solo puede contener letras, números, puntos, guiones y guion bajo.");
        validarCampo(passwordRegex, inputPass, "La contraseña tiene que ser de 4 a 12 dígitos.");

        if (estadoValidacionCampos.userEmail && estadoValidacionCampos.userPassword) {
            enviarFormulario(formLogin, alertaErrorLogin, alertaExitoLogin);
        } else {
            alertaErrorLogin.textContent = "Por favor, completa todos los campos correctamente.";
            alertaErrorLogin.classList.add("alertaError");
            setTimeout(() => {
                alertaErrorLogin.classList.remove("alertaError");
            }, 3000);

            // Enfocar el primer campo inválido
            if (!estadoValidacionCampos.userEmail) {
                inputEmail.focus();
            } else if (!estadoValidacionCampos.userPassword) {
                inputPass.focus();
            }
        }
    });

    inputEmail.addEventListener("input", () => {
        validarCampo(emailRegex, inputEmail, "El correo solo puede contener letras, números, puntos, guiones y guion bajo.");
    });

    inputPass.addEventListener("input", () => {
        validarCampo(passwordRegex, inputPass, "La contraseña tiene que ser de 4 a 12 dígitos.");
    });
});