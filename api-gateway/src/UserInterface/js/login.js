document.getElementById('login').addEventListener('submit', async function(event) {
    event.preventDefault();
    const usuario = document.getElementById('usuarioLogin').value;
    const contrasena = document.getElementById('contrasenaLogin').value;
    try {
        const response = await fetch('http://localhost:3000/autentificacionLog/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombreUsuario: usuario, contrasena: contrasena })
        });
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            window.location.href = 'principal.html';
        } else {
            const errorData = await response.json();
            document.getElementById('mensajes').textContent = errorData.detail || 'El inicio de sesión a fallado.';
        }
    } catch (error) {
        document.getElementById('mensajes').textContent = 'A ocurrido un error inesperado.';
    }
});