const ListaParticipantes = [];
const error = document.querySelector('p.error');
let idUsuario;
let notificaciones = [];
let grupoActual;
document.getElementById('menuIcono').addEventListener('click', async function() {
    document.getElementById('barra_lateral').style.width = '350px';
    document.getElementById('menuIcono').style.display = 'none';
    document.getElementById('cerrarBarra').style.display = 'inline';
    document.getElementById('Perfil').style.marginLeft = '90%';
    console.log("ID USUARIO: "+idUsuario);
    const token = localStorage.getItem('token');
    try{
        const response = await fetch('http://localhost:3000/eventos/listaNotificacion', {
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
    document.getElementById('Perfil').style.marginLeft = '85%';
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

document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/usuarios/usuario', {
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
            const response = await fetch('http://localhost:3000/usuarios/usuarioCorreo?correo='+encodeURIComponent(participante), {
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

document.getElementById('FechaInicio').addEventListener('change', cambioDeFecha);
document.getElementById('FechaFin').addEventListener('change', cambioDeFecha);
async function cambioDeFecha(){
    const fechaini = document.getElementById('FechaInicio').value;
    const fechafin = document.getElementById('FechaFin').value;
    if(fechaini && fechafin){
        if(fechaini > fechafin){
            document.getElementById('FechaInicio').value = '';
            document.getElementById('FechaFin').value = '';
            error.textContent = 'La fecha de inicio no puede ser mayor que la fecha de fin';
        }else{
            try{
                const response = await fetch('http://localhost:3000/eventos/comprobarFestivo?fechaInicio='+encodeURIComponent(fechaini)+'&fechaFin=' + encodeURIComponent(fechafin), {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    }
                });
                if(response.ok){
                    const data = await response.json();
                    if(data.length > 0){
                        let respuesta = "";
                        for(let festivo of data){
                            respuesta += "Hay un festivo desde el " + festivo.startDate + " hasta " + festivo.endDate + ".\n";
                        }
                        alert(respuesta);
                    }
                }else{
                    const e = await response.json();
                    error.textContent = e.detail || 'Error al comprobar las fechas';
                }
            } catch(error){
                console.error('Error: ', error);
                error.textContent = 'Error al comprobar las fechas';
            }
        }
    }
}