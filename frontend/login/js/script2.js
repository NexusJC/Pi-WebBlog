document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const userName = document.querySelector('input[name="userName"]').value;
            const userEmail = document.querySelector('input[name="userEmail"]').value;
            const userPassword = document.querySelector('input[name="userPassword"]').value;

            console.log('Enviando:', { userName, userEmail, userPassword });

            try {
                const response = await fetch('/registrar', {
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
    } else {
        console.error('Formulario no encontrado');
    }
});
