let evento = null;
let notificaciones = [];
let grupoActual;

document.getElementById('menuIcono').addEventListener('click', async function() {
    document.getElementById('barra_lateral').style.width = '350px';
    document.getElementById('menuIcono').style.display = 'none';
    document.getElementById('cerrarBarra').style.display = 'inline';
    document.getElementById('Principal').style.marginLeft = '75%';
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
    document.getElementById('Principal').style.marginLeft = '70%';
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

    // Extract the event ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const idEvento = urlParams.get('id');

    if (!idEvento) {
        console.error('No event ID provided');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/eventos/detalle?idEvento='+encodeURIComponent(idEvento), {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (response.ok) {
            evento = await response.json();
            
            document.getElementById('Nombre').textContent = "Nombre:" + evento.nombre;
            document.getElementById('FechaIni').textContent = 'Fecha Inicio: ' + evento.fechaini;
            document.getElementById('FechaFin').textContent = 'Fecha fin: ' + evento.fechafin;
            document.getElementById('Lugar').textContent = 'Lugar: ' + evento.lugar;
            document.getElementById('Descripcion').textContent = 'Descripcion:' + evento.descripcion;
            document.getElementById('Creador').textContent = 'Creador: ' + evento.correo;
            try {
                const response = await fetch('http://localhost:3000/usuarios/usuario', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });
        
                if (response.ok) {
                    const data = await response.json();
                    if(evento.correo !== data.correo){
                        document.getElementById('botonEditar').style.display = 'none';
                    }
                } else {
                    console.error('Error al obtener el usuario');
                }
            } catch (error) {
                console.error('Error: ', error);
            }
            evento.invitados.forEach(invitado => {
                const li = document.createElement('li');
                li.textContent = invitado.nombreUsuario + " (" + invitado.correo + ")";
                document.getElementById('Participantes').appendChild(li);
            });
        } else {
            console.error('Error al obtener el evento');
        }
    } catch (error) {
        console.error('Error: ', error);
    }
});

document.getElementById("Favoritos").addEventListener('click', async function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    } 
    const idEvento = new URLSearchParams(window.location.search).get('id');
    try {
        const response = await fetch('http://localhost:3000/eventos/agregarFavorito?idEvento='+encodeURIComponent(idEvento), {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (response.ok) {
            alert('Evento agregado a favoritos');
        } else {
            console.error('Error al agregar a favoritos');
        }
    } catch (error) {
        console.error('Error: ', error);
    }
});

document.getElementById('botonEditar').addEventListener('click', function() {
    document.getElementById('Ver').style.display = 'none';
    document.getElementById('Editar').style.display = 'block';
    document.getElementById('NombreEdit').value = evento.nombre;
    document.getElementById('FechaInicioEdit').value = evento.fechaini;
    document.getElementById('FechaFinEdit').value = evento.fechafin;
    document.getElementById('LugarEdit').value = evento.lugar;
    document.getElementById('DescripcionEdit').value = evento.descripcion;
    document.getElementById('CreadorEdit').textContent = 'Creador:' + evento.correo;
    document.getElementById('botonInvitar').addEventListener('click', invitar);
    document.getElementById('botonCancelar').addEventListener('click', desinvitar);
    document.getElementById('botonGuardar').addEventListener('click', guardar);
    evento.invitados.forEach(invitado => {
        const li = document.createElement('li');
        li.textContent = invitado.nombreUsuario + " (" + invitado.correo + ")";
        document.getElementById('ParticipantesEditar').appendChild(li);
    });                
});

async function invitar(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const invitadoNuevo = document.getElementById("ParticipantesEdit").value;
    try {
        const response = await fetch('http://localhost:3000/eventos/updateInvite?idEvento='+encodeURIComponent(evento.id)+"&"+"invitado="+encodeURIComponent(invitadoNuevo), {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (response.ok) {
            const data = await response.json();
            const li = document.createElement('li');
            li.textContent = data.nombreUsuario + " (" + data.correo + ")";
            document.getElementById('ParticipantesEditar').appendChild(li);
            document.getElementById("ParticipantesEdit").value = "";
        } else {
            console.error('Error al actualizarEvento');
        }
    } catch (error) {
        console.error('Error: ', error);
    }
}

async function desinvitar(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const desinvitar = document.getElementById("ParticipantesEdit").value;
    try {
        const response = await fetch('http://localhost:3000/eventos/updateUninvite?idEvento='+encodeURIComponent(evento.id)+"&"+"invitado="+encodeURIComponent(desinvitar), {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (response.ok) {
            const data = await response.json();
            const lista = document.getElementById('ParticipantesEditar');
            const lis = lista.getElementsByTagName('li');
            for(let i = 0; i < lis.length; i++){
                //obtener el correo del li (aparece entre parentesis)
                const correo = lis[i].textContent.split('(')[1].split(')')[0];
                if(correo === desinvitar){
                    evento.invitados.splice(i, 1);
                    lista.removeChild(lis[i]);
                    document.getElementById("ParticipantesEdit").value = "";
                    break;
                }
            }
        } else {
            console.error('Error al actualizarEvento');
        }
    } catch (error) {
        console.error('Error: ', error);
    }
}

async function guardar(event){
    event.preventDefault();
    const token = localStorage.getItem('token');
    const nombre = document.getElementById('NombreEdit').value;
    const fechaini = document.getElementById('FechaInicioEdit').value;
    const fechafin = document.getElementById('FechaFinEdit').value;
    const lugar = document.getElementById('LugarEdit').value;
    const descripcion = document.getElementById('DescripcionEdit').value;
    let cambio = "";
    let campo = "";
    if(nombre !== evento.nombre){
        cambio = nombre;
        campo = "nombre";
        enviarCambio(evento.id, evento.correo, campo, cambio);
    }
    if(fechaini !== evento.fechaini){
        cambio = fechaini;
        campo = "fechaini";
        enviarCambio(evento.id, evento.correo, campo, cambio);
    }
    if(fechafin !== evento.fechafin){
        cambio = fechafin;
        campo = "fechafin";
        enviarCambio(evento.id, evento.correo, campo, cambio);
    }
    if(lugar !== evento.lugar){
        cambio = lugar;
        campo = "lugar";
        enviarCambio(evento.id, evento.correo, campo, cambio);
    }
    if(descripcion !== evento.descripcion){
        cambio = descripcion;
        campo = "descripcion";
        enviarCambio(evento.id, evento.correo, campo, cambio);
    }
    if(cambio == ""){
        window.location.reload();
    }
}

async function enviarCambio(evento, usuario, campo, cambio){
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:3000/eventos/updateEvento?idEvento=' + encodeURIComponent(evento) + '&idUsuario=' + encodeURIComponent(usuario)+'&campo='+encodeURIComponent(campo)+'&cambio='+encodeURIComponent(cambio), {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (response.ok) {
            window.location.reload();
        } else {
            console.error('Error al actualizarEvento');
        }
    } catch (error) {
        console.error('Error: ', error);
    }
}

document.getElementById('deshacer').addEventListener('click', async function() {
    const token = localStorage.getItem('token');
    const idEvento = new URLSearchParams(window.location.search).get('id');
    try {
        const response = await fetch('http://localhost:3000/eventos/deshacer?idEvento='+encodeURIComponent(idEvento), {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (response.ok) {
            alert('Evento deshecho');
            window.location.reload();
        } else {
            console.error('Error al deshacer');
        }
    } catch (error) {
        console.error('Error: ', error);
    }
});

document.getElementById('FechaInicioEdit').addEventListener('change', cambioDeFecha);
document.getElementById('FechaFinEdit').addEventListener('change', cambioDeFecha);
async function cambioDeFecha(){
    const fechaini = document.getElementById('FechaInicioEdit').value;
    const fechafin = document.getElementById('FechaFinEdit').value;
    if(fechaini && fechafin){
        if(fechaini > fechafin){
            document.getElementById('FechaInicioEdit').value = '';
            document.getElementById('FechaFinEdit').value = '';
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
                }
            } catch(error){
                console.error('Error: ', error);
            }
        }
    }
}