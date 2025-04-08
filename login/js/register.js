// Regex para validaciones
export const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
export const passwordRegex = /^.{4,12}$/;

const userNameRegex = /^[a-zA-Z0-9\_\-]{4,16}$/;

// Estado de validación de los campos
export const estadoValidacionCampos = {
    userName: false,
    userEmail: false,
    userPassword: false,
};

// Elementos del formulario de registro
const formRegister = document.querySelector(".form-register");
const inputUser = document.querySelector(".form-register input[type='text']");
const inputEmail = document.querySelector(".form-register input[type='email']");
const inputPass = document.querySelector(".form-register input[type='password']");
const alertaError = document.querySelector(".form-register .alerta-error");
const alertaExito = document.querySelector(".form-register .alerta-exito");

// Lógica del DOM
document.addEventListener("DOMContentLoaded", () => {
    formRegister.addEventListener("submit", (e) => {
        e.preventDefault(); // Evitar que el formulario se envíe

        if (estadoValidacionCampos.userName && estadoValidacionCampos.userEmail && estadoValidacionCampos.userPassword) {
            enviarFormulario(formRegister, alertaError, alertaExito);
        } else {
            alertaError.textContent = "Por favor, completa todos los campos correctamente.";
            alertaError.classList.add("alertaError");
            setTimeout(() => {
                alertaError.classList.remove("alertaError");
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

// Validación de campos individuales
export function validarCampo(regularExpresion, campo, mensaje) {
    const esValido = regularExpresion.test(campo.value);
    if (esValido) {
        eliminarAlerta(campo.parentElement.parentElement);
        estadoValidacionCampos[campo.name] = true;
        campo.parentElement.classList.remove("error");
    } else {
        estadoValidacionCampos[campo.name] = false;
        mostrarAlerta(campo.parentElement.parentElement, mensaje);
        campo.parentElement.classList.add("error");
    }
}

// Mostrar alerta debajo del campo
function mostrarAlerta(referencia, mensaje) {
    eliminarAlerta(referencia);
    const alertaDiv = document.createElement("div");
    alertaDiv.classList.add("alerta");
    alertaDiv.textContent = mensaje;
    referencia.appendChild(alertaDiv);
}

// Eliminar alerta anterior
function eliminarAlerta(referencia) {
    const alerta = referencia.querySelector(".alerta");
    if (alerta) alerta.remove();
}

// Acción al enviar el formulario correctamente
export function enviarFormulario(form, alertaError, alertaExito) {
    alertaExito.textContent = "Te registraste correctamente";
    alertaExito.classList.add("alertaExito");
    alertaError.classList.remove("alertaError");
    form.reset();

    // Reiniciar estado
    estadoValidacionCampos.userName = false;
    estadoValidacionCampos.userEmail = false;
    estadoValidacionCampos.userPassword = false;

    setTimeout(() => {
        alertaExito.classList.remove("alertaExito");
    }, 3000);
}
