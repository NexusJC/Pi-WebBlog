document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obtener los valores de los campos por 'name' o 'id'
    const userName = document.querySelector('input[name="userName"]').value;
    const userEmail = document.querySelector('input[name="userEmail"]').value;
    const userPassword = document.querySelector('input[name="userPassword"]').value;


    ////////////////////////////////////////////////////////////////////7
      // Obtener los elementos de alerta
    const alertaError = document.querySelector('.alerta-error');
    const alertaExito = document.querySelector('.alerta-exito');

    // Validación de campos vacíos
    if (!userName || !userEmail || !userPassword) {
        alertaError.textContent = "Todos los campos son obligatorios";
        alertaError.style.display = "block";
        alertaExito.style.display = "none";
        return;
    }

    // Validación de correo electrónico
    if (!validarEmail(userEmail)) {
        alertaError.textContent = "Correo electrónico no válido";
        alertaError.style.display = "block";
        alertaExito.style.display = "none";
        return;
    }

    // Validación de contraseña (mínimo 6 caracteres)
    if (userPassword.length < 6) {
        alertaError.textContent = "La contraseña debe tener al menos 6 caracteres";
        alertaError.style.display = "block";
        alertaExito.style.display = "none";
        return;
    }

    // Si todo está correcto, ocultar el error y mostrar el éxito
    alertaError.style.display = "none";
    alertaExito.style.display = "block";
    alertaExito.textContent = "Te registraste correctamente";

    //////////////////////////////////////////////////////////////////


    console.log('Enviando:', { userName, userEmail, userPassword });



    try {
        const response = await fetch('http://localhost:3001/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userName, userEmail, userPassword })
        });

        const result = await response.json();
        console.log('Respuesta del servidor:', result);

        if (result.success) {
            alert('Usuario registrado con éxito');
            window.location.href = "../menú/index.html"; // Redirigir a la página de inicio de sesión
        } else {
            alert('Error al registrar usuario: ' + result.message);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('No se pudo conectar con el servidor.');
    }
});

// Función para validar formato de email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
