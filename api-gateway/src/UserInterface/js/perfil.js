document.getElementById('editarButton').addEventListener('click', function() {
    document.getElementById('Perfil').style.display = 'none';
    document.getElementById('Editar').style.display = 'block';
});

document.getElementById('guardar').addEventListener('click', async function() {
    document.getElementById('Perfil').style.display = 'block';
    document.getElementById('Editar').style.display = 'none';
    const nuevoEmail = document.getElementById('correoEdit').value;
    const contrasenaVieja = document.getElementById('contrasenaAntigua').value;
    const contrasenaNueva = document.getElementById('contrasena').value;
    const contrasenaRepetida = document.getElementById('repetirContrasena').value;
    const token = localStorage.getItem('token');
    //enviar cambios
    try {
        const response = await fetch('http://localhost:3000/autentificacionMod/actualizar', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                contrasenaAntigua: contrasenaVieja,
                contrasenaNueva: contrasenaNueva,
                contrasenaRepetida: contrasenaRepetida,
                correo: nuevoEmail,
            })
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('Correo').textContent = 'Correo: ' + nuevoEmail;
            document.getElementById('correoEdit').value = nuevoEmail;
            document.getElementById('contrasena').value = '';
            document.getElementById('repetirContrasena').value = '';
            alert('Perfil actualizado correctamente');
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Error al actualizar el perfil');
        }
    } catch (error) {
        console.error('Error: ', error);
        alert('Error al actualizar el perfil');
    }
});   

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('http://localhost:3000/autentificacionMod/usuario', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('Usuario').textContent = 'Nombre de usuario: ' + data.nombreUsuario;
            document.getElementById('usuarioEdit').textContent = 'Nombre de usuario: ' + data.nombreUsuario;
            document.getElementById('Correo').textContent = 'Correo: ' + data.correo;
            document.getElementById('correoEdit').value = data.correo;
        } else {
            console.error('Error al obtener el usuario');
        }
    } catch (error) {
        console.error('Error: ', error);
    }
});
/*document.getElementById('guardar').addEventListener('click', function() {
    const newEmail = document.getElementById('correoEdit').value;
    document.getElementById('Correo').textContent = 'Correo: ' + newEmail;
    document.getElementById('Correo').classList.remove('hidden');
    document.getElementById('correoEdit').classList.add('hidden');
    document.getElementById('editarButton').classList.remove('hidden');
    document.getElementById('guardar').classList.add('hidden');
    document.getElementById('Editar').classList.add('hidden');

    // Here you would send the updated email and password to the server
    // For example, using fetch or axios
    const currentPassword = document.getElementById('contrasena').value;
    const newPassword = document.getElementById('repetirContrasena').value;

    // Example of sending data to the server
    fetch('/update-profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: newEmail,
            currentPassword: currentPassword,
            newPassword: newPassword
        })
    }).then(response => {
        if (response.ok) {
            alert('Perfil actualizado correctamente');
        } else {
            alert('Error al actualizar el perfil');
        }
    }).catch(error => {
        console.error('Error:', error);
        alert('Error al actualizar el perfil');
    });
});*/