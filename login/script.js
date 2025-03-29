document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obtener los valores de los campos por 'name' o 'id'
    const userName = document.querySelector('input[name="userName"]').value;
    const userEmail = document.querySelector('input[name="userEmail"]').value;
    const userPassword = document.querySelector('input[name="userPassword"]').value;

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
        } else {
            alert('Error al registrar usuario: ' + result.message);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('No se pudo conectar con el servidor.');
    }
});
