/*(function () {
    const formLogin = document.querySelector(".form-login");
    const inputEmail = document.querySelector(".form-login input[type='email']");
    const inputPass = document.querySelector(".form-login input[type='password']");
    const alertaError = document.querySelector(".form-login .alerta-error");
    const alertaExito = document.querySelector(".form-login .alerta-exito");
    
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    const passwordRegex = /^.{4,12}$/;
    
    const estadoValidocionCampos = {
        userEmail: false,
        userPassword: false,
    };
    
    
    
    document.addEventListener("DOMContentLoaded", () => {
        formLogin.addEventListener("submint", e => {
        e.preventDefault();
        enviarformulario()
        });
    
        inputEmail.addEventListener("input", () => {
            validarCampo(emailRegex,inputEmail,"El correo solo puede contener letras, números, puntos, guiones y guíon bajo.")
        })
    
        inputPass.addEventListener("input", () => {
            validarCampo(passwordRegex, inputPass,"La contraseña tiene que ser de 4 a 12 dígitos.")
        })
    
    })
    
    
    function validarCampo(regularExpresion,campo,mensaje) {
        const validarCampo = regularExpresion.test(campo.value);
        if (validarCampo) {
            eliminarAlerta(campo.parentElement.parentElement)
            estadoValidocionCampos[campo.name] = true;
            campo.parentElement.classList.remove("error");
            return;
        }
    
        estadoValidocionCampos[campo.name] = false;
        mostrarAlerta(campo.parentElement.parentElement,mensaje)
        campo.parentElement.classList.add("error");
    }
    
    function mostrarAlerta(referencia,mensaje) {
        eliminarAlerta(referencia)
        console.log(referencia)
        const alertaDiv = document.createElement("div")
        alertaDiv.classList.add("alerta")
        alertaDiv.textContent = mensaje;
        referencia.appendChild(alertaDiv)
    }
    
    function eliminarAlerta(referencia) {
        const alerta = referencia.querySelector(".alerta");
        
        if (alerta) {
            alerta.remove();
        }
    }
    
    
    
    function enviarformulario() {
        if (estadoValidocionCampos.userEmail && estadoValidocionCampos.userPassword) {
            alertaExito.classList.add("alertaExito");
            alertaExito.classList.remove("alertaError");
            formLogin.reset();
            setTimeout(() => {
                alertaExito.classList.remove("alertaExito");
            }, 3000);
            return;
        }
    
        alertaExito.classList.remove("alertaExito");
        alertaExito.classList.add("alertaError");
        setTimeout(() => {
            alertaExito.classList.remove("alertaExito");
        }, 3000);
    }
    
    })();
    */
    (function () {
        const formLogin = document.querySelector(".form-login");
        const inputEmail = document.querySelector(".form-login input[type='email']");
        const inputPass = document.querySelector(".form-login input[type='password']");
        const alertaError = document.querySelector(".form-login .alerta-error");
        const alertaExito = document.querySelector(".form-login .alerta-exito");
    
        const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        const passwordRegex = /^.{4,12}$/;
    
        const estadoValidacionCampos = {
            userEmail: false,
            userPassword: false,
        };
    
        document.addEventListener("DOMContentLoaded", () => {
            formLogin.addEventListener("submit", (e) => {
                e.preventDefault(); // Evitar que el formulario se envíe
    
                // Validar todos los campos antes de continuar
                validarCampo(emailRegex, inputEmail, "El correo solo puede contener letras, números, puntos, guiones y guion bajo.");
                validarCampo(passwordRegex, inputPass, "La contraseña tiene que ser de 4 a 12 dígitos.");
    
                if (estadoValidacionCampos.userEmail && estadoValidacionCampos.userPassword) {
                    enviarFormulario();
                } else {
                    alertaError.textContent = "Por favor, completa todos los campos correctamente.";
                    alertaError.classList.add("alertaError");
                    setTimeout(() => {
                        alertaError.classList.remove("alertaError");
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
    
        function validarCampo(regularExpresion, campo, mensaje) {
            const esValido = regularExpresion.test(campo.value);
            if (esValido) {
                eliminarAlerta(campo.parentElement.parentElement);
                estadoValidacionCampos[campo.name] = true;
                campo.parentElement.classList.remove("error");
            } else {
                estadoValidacionCampos[campo.name] = false;
                mostrarAlerta(campo, mensaje);
                campo.parentElement.classList.add("error");
            }
        }
    
        function mostrarAlerta(campo, mensaje) {
            eliminarAlerta(campo.parentElement.parentElement);
            const alertaDiv = document.createElement("div");
            alertaDiv.classList.add("alerta");
            alertaDiv.textContent = mensaje;
            campo.parentElement.parentElement.appendChild(alertaDiv);
        }
    
        function eliminarAlerta(referencia) {
            const alerta = referencia.querySelector(".alerta");
            if (alerta) alerta.remove();
        }
    
        function enviarFormulario() {
            const formData = new FormData(formLogin);
    
            fetch('https://ejemplo.com/login', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                alertaExito.classList.add("alertaExito");
                alertaExito.textContent = "Iniciaste sesión correctamente";
                alertaError.classList.remove("alertaError");
                formLogin.reset();
    
                setTimeout(() => {
                    alertaExito.classList.remove("alertaExito");
                }, 3000);
            })
            .catch(error => {
                alertaError.classList.add("alertaError");
                alertaError.textContent = "Hubo un error al iniciar sesión";
                alertaExito.classList.remove("alertaExito");
                setTimeout(() => {
                    alertaError.classList.remove("alertaError");
                }, 3000);
            });
        }
    })();
