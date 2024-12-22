document.getElementById('menuIcono').addEventListener('click', async function() {
    document.getElementById('barra_lateral').style.width = '350px';
    document.getElementById('menuIcono').style.display = 'none';
    document.getElementById('cerrarBarra').style.display = 'inline';
    document.getElementById('inicio').style.marginLeft = '90%';
    const token = localStorage.getItem('token');
    try{
        const response = await fetch('http://localhost:3000/notificaciones/listaNotificacion', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }})
            if(response.ok){
                notificaciones = [];
                const data = await response.json();
                grupoActual = 0;
                const notificaciones2 = data.notificaciones;
                notificaciones = notificaciones2;
                let i = 0;
                let ul = document.getElementById('datosBarra');
                for (let notificacion of notificaciones2) {
                    if (i >= 10) {
                        break;
                    }
                    let li = document.createElement('li');
                    li.id = 'notificacion' + i;
                    li.textContent = notificacion;
                    ul.appendChild(li);
                    i++;
                }
                if(notificaciones.length < 11){
                    document.getElementById('Siguiente').disabled = true;
                }
            }
    }catch (error){
        console.error('Error: ', error);
    }
    document.getElementById('Previo').disabled = true;
});

document.getElementById('cerrarBarra').addEventListener('click', async function() {
    document.getElementById('barra_lateral').style.width = '0';
    document.getElementById('menuIcono').style.display = 'inline';
    document.getElementById('cerrarBarra').style.display = 'none';
    document.getElementById('inicio').style.marginLeft = '85%';
    document.getElementById('datosBarra').innerHTML = '';
});

document.getElementById('Siguiente').addEventListener('click', async function() {
    grupoActual++;
    let ul = document.getElementById('datosBarra');
    ul.innerHTML = '';
    let i = 0;
    for (let notificacion of notificaciones) {
        if (i >= 10 * grupoActual && i < 10 * (grupoActual + 1)) {
            let li = document.createElement('li');
            li.id = 'notificacion' + i;
            li.textContent = notificacion;
            ul.appendChild(li);
        }
        i++;
    }
    document.getElementById('Previo').disabled = false;
    if (grupoActual === Math.floor(notificaciones.length/10)) {
        document.getElementById('Siguiente').disabled = true;
    }
});
document.getElementById('Previo').addEventListener('click', async function() {
    grupoActual--;
    let ul = document.getElementById('datosBarra');
    ul.innerHTML = '';
    let i = 0;
    for (let notificacion of notificaciones) {
        if (i >= 10 * grupoActual && i < 10 * (grupoActual + 1)) {
            let li = document.createElement('li');
            li.id = 'notificacion' + i;
            li.textContent = notificacion;
            ul.appendChild(li);
        }
        i++;
    }
    document.getElementById('Siguiente').disabled = false;
    if (grupoActual === 0) {
        document.getElementById('Previo').disabled = true;
    }
});

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