document.getElementById('register').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nombreUsuario = document.getElementById('usuarioRegister').value;
    const contrasena = document.getElementById('contrasenaRegister').value;
    const correo = document.getElementById('email').value;
    try {
        const response = await fetch('http://localhost:3000/usuarios/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombreUsuario: nombreUsuario, contrasena: contrasena, correo: correo })
        });

        if (response.ok) {
            const data = await response.json();
            window.location.href = 'login.html';
        } else {
            const errorData = await response.json();
            document.getElementById('mensajes').textContent = errorData.message || 'No se ha registrado bien.';
        }
    } catch (error) {
        document.getElementById('mensajes').textContent = 'Ha ocurrido un error inesperado.';
    }
});