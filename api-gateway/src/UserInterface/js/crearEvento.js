const ListaParticipantes = [];
const error = document.querySelector('p.error');
let idUsuario;
document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/autentificacionMod/usuario', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (response.ok) {
            const data = await response.json();
            document.querySelector('p').textContent = 'Creador: '+ data.nombreUsuario;
            idUsuario = data.idUsuario;
            //AQUIIII
            console.log(idUsuario);
        } else {
            console.error('Error al obtener el usuario');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error: ', error);
        window.location.href = 'login.html';
    }
});
document.getElementById('botonInvitar').addEventListener('click', async function() {
    event.preventDefault();
    const participantesInput = document.getElementById('Participantes');
    const lista = document.querySelector('ul');
    const participante = participantesInput.value.trim();   
    if (participante) {
        try{
            const response = await fetch('http://localhost:3000/autentificacionMod/usuarioCorreo?correo='+encodeURIComponent(participante), {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
            });
            if (response.ok){
                const data = await response.json();
                ListaParticipantes.push(data);
                const li = document.createElement('li');
                li.textContent = data.nombreUsuario + " (" + data.correo + ")";
                lista.appendChild(li);
                participantesInput.value = '';
                error.textContent = '';
            }else{
                const e = await response.json();
                error.textContent = e.detail || 'El email del participante no existe.';
            }
        }catch (error){
            console.error('Error: ', error);
            error.textContent = 'Error al invitar al participante con email';
        }
    }else{
        error.textContent = 'Debes introducir el email del participante';
    }
});

document.getElementById('botonGuardar').addEventListener('click', async function(){
    event.preventDefault();
    const token = localStorage.getItem('token');
    const nombre = document.getElementById('Nombre').value;
    const descripcion = document.getElementById('Descripcion').value;
    const lugar = document.getElementById('Lugar').value;
    const fechaini = document.getElementById('FechaInicio').value;
    const fechafin = document.getElementById('FechaFin').value;
    
    console.log(ListaParticipantes);
    console.log(idUsuario);
    console.log(nombre);
    console.log(descripcion);
    console.log(lugar);
    console.log(fechaini);
    if (nombre && descripcion && lugar && fechaini && fechafin){
        try{
            const response = await fetch('http://localhost:3000/eventos/crear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    nombre: nombre,
                    descripcion: descripcion,
                    lugar: lugar,
                    fechaini: fechaini,
                    fechafin: fechafin,
                    participantes: ListaParticipantes,
                    idUsuario: idUsuario
                })
            });
            if (response.ok){
                window.location.href = 'principal.html';
            }else{
                const e = await response.json();
                error.textContent = e.detail || 'Error al crear el evento';
            }
        }catch (error){
            console.error('Error: ', error);
            error.textContent = 'Error al crear el evento';
        }
    }else{
        error.textContent = 'Debes rellenar todos los campos';
    }
});