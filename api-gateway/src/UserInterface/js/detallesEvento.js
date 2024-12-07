let evento = null;
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
                const response = await fetch('http://localhost:3000/autentificacionMod/usuario', {
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
    try {
        const response = await fetch('http://localhost:3000/eventos/updateEvento?idEvento='+encodeURIComponent(evento.id)+"&nombre="+encodeURIComponent(nombre)+"&fechaini="+encodeURIComponent(fechaini)+"&fechafin="+encodeURIComponent(fechafin)+"&lugar="+encodeURIComponent(lugar)+"&descripcion="+encodeURIComponent(descripcion), {
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