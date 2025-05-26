document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const userName = document.querySelector('input[name="userName"]').value;
    const userEmail = document.querySelector('input[name="userEmail"]').value;
    const userPassword = document.querySelector('input[name="userPassword"]').value;

    const alertaError = document.querySelector('.alerta-error');
    const alertaExito = document.querySelector('.alerta-exito');

    if (!userName || !userEmail || !userPassword) {
        alertaError.textContent = "Todos los campos son obligatorios";
        alertaError.style.display = "block";
        alertaExito.style.display = "none";
        return;
    }

    if (!validarEmail(userEmail)) {
        alertaError.textContent = "Correo electrónico no válido";
        alertaError.style.display = "block";
        alertaExito.style.display = "none";
        return;
    }

    if (userPassword.length < 6) {
        alertaError.textContent = "La contraseña debe tener al menos 6 caracteres";
        alertaError.style.display = "block";
        alertaExito.style.display = "none";
        return;
    }

    alertaError.style.display = "none";
    alertaExito.style.display = "block";
    alertaExito.textContent = "Te registraste correctamente";

    try {
        const response = await fetch('http://localhost:3001/registrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName, userEmail, userPassword })
        });

        const result = await response.json();

        if (result.success) {
            // ✅ Guardar en localStorage
            localStorage.setItem("userId", result.userId);
            localStorage.setItem("userName", result.userName);
            localStorage.setItem("userRole", "usuario");

            alert('Usuario registrado con éxito');
            window.location.href = "../menu/index.html";
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
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector(".form-login");

  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userEmail = loginForm.userEmail.value;
    const userPassword = loginForm.userPassword.value;

    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, password: userPassword })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("userId", data.userId);     // ✅ Este es clave
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userRole", data.role);
        window.location.href = "../menu/index.html";
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error en login:", error);
      alert("No se pudo conectar con el servidor");
    }
  });
});
