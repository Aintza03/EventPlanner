let idUsuario;
async function eliminarFavorito(event) {
    const token = localStorage.getItem('token');
    const botonId = event.target.id;
    const filaEvento = botonId.split('_')[0].replace('button', 'tr');
    const idEvento = filaEvento.replace('trPestana3', '');
    try {
        const response = await fetch('http://localhost:3000/eventos/eliminarFavorito?idEvento=' + encodeURIComponent(idEvento), {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        if (response.ok) {
            const data = await response.json();
            const fila = document.getElementById(filaEvento);
            fila.remove();
        } else {
            console.error('Error al eliminar el evento');
        }
    } catch (error) {
        console.error('Error: ', error);
    }    
}
async function eliminarEvento(event) {
    const token = localStorage.getItem('token');
    const botonId = event.target.id;
    const filaEvento = botonId.split('_')[0].replace('button', 'tr');
    const idEvento = filaEvento.replace('trPestana1', '');
    try {
        const response = await fetch('http://localhost:3000/eventos/borrar?idEvento=' + encodeURIComponent(idEvento), {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        if (response.ok) {
            const data = await response.json();
            const fila = document.getElementById(filaEvento);
            fila.remove();
        } else {
            console.error('Error al eliminar el evento');
        }
    } catch (error) {
        console.error('Error: ', error);
    }
}
async function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="contenido" and hide them
    tabcontent = document.getElementsByClassName("contenido");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="pestana" and remove the class "active"
    tablinks = document.getElementsByClassName("pestana");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    if (tabName === 'Desplegable1') {
        //delete all the td of the table
        const table = document.querySelector('#Desplegable1 table');
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const th = row.querySelector('th');
            if (!th) {
                row.remove();
            }
        });
        try {
            const response = await fetch('http://localhost:3000/eventos/misEventos?id='+ encodeURIComponent(idUsuario), {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

            if (response.ok) {
                const data = await response.json();
                data.eventos.forEach(evento => {
                    const tabla = document.querySelector('#Desplegable1 table');
                    const tr = document.createElement('tr');
                    const tdName = document.createElement('td');
                    const link = document.createElement('a');
                    link.textContent = evento.nombre;
                    link.href = 'detallesEvento.html?id=' + evento.id;
                    tdName.appendChild(link);
                    const tdFechaIni = document.createElement('td');
                    tdFechaIni.textContent = evento.fechaini;
                    const tdFechaFin = document.createElement('td');
                    tdFechaFin.textContent = evento.fechafin;
                    const tdLugar = document.createElement('td');
                    tdLugar.textContent = evento.lugar;
                    const tdDescripcion = document.createElement('td');
                    tdDescripcion.textContent = evento.descripcion;
                    const tdEliminar = document.createElement('td');
                    const button = document.createElement('button');
                    button.textContent = 'Eliminar';                   
                    button.classList.add('eliminar');
                    button.id = 'buttonPestana1' + evento.id +"_"+ evento.idUsuario;
                    button.addEventListener('click', eliminarEvento);
                    tdEliminar.appendChild(button);
                    tr.appendChild(tdName);
                    tr.appendChild(tdFechaIni);
                    tr.appendChild(tdFechaFin);
                    tr.appendChild(tdLugar);
                    tr.appendChild(tdDescripcion);
                    tr.appendChild(tdEliminar);
                    tr.id = 'trPestana1' + evento.id;
                    tabla.appendChild(tr);
                });
            } else {
                console.error('Error al obtener los eventos');
            }
        } catch (error) {
            console.error('Error: ', error);
        }
    }else if (tabName === 'Desplegable2') {
        const table = document.querySelector('#Desplegable2 table');
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const th = row.querySelector('th');
            if (!th) {
                row.remove();
            }
        });
        try {
            const response = await fetch('http://localhost:3000/eventos/invitaciones?id='+ encodeURIComponent(idUsuario), {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                data.invitaciones.forEach(evento => {
                    const tabla = document.querySelector('#Desplegable2 table');
                    const tr = document.createElement('tr');
                    const tdName = document.createElement('td');
                    const link = document.createElement('a');
                    link.textContent = evento.nombre;
                    link.href = 'detallesEvento.html?id=' + evento.id;
                    tdName.appendChild(link);
                    const tdFechaIni = document.createElement('td');
                    tdFechaIni.textContent = evento.fechaini;
                    const tdFechaFin = document.createElement('td');
                    tdFechaFin.textContent = evento.fechafin;
                    const tdLugar = document.createElement('td');
                    tdLugar.textContent = evento.lugar;
                    const tdDescripcion = document.createElement('td');
                    tdDescripcion.textContent = evento.descripcion;
                    const tdEstatus = document.createElement('td');
                    const selector = document.createElement('select');
                    const option1 = document.createElement('option');
                    option1.value = 'Pending';
                    option1.textContent = 'Pendiente';
                    const option2 = document.createElement('option');
                    option2.value = 'Acceptado';
                    option2.textContent = 'Aceptado';
                    const option3 = document.createElement('option');
                    option3.value = 'Rechazado';
                    option3.textContent = 'Rechazado';
                    selector.appendChild(option1);
                    selector.appendChild(option2);
                    selector.appendChild(option3);
                    selector.selectedIndex = evento.status === 'Pending' ? 0 : (evento.status === 'Acceptado' ? 1 : 2);
                    tdEstatus.appendChild(selector);
                    tr.appendChild(tdName);
                    tr.appendChild(tdFechaIni);
                    tr.appendChild(tdFechaFin);
                    tr.appendChild(tdLugar);
                    tr.appendChild(tdDescripcion);
                    tr.appendChild(tdEstatus);
                    tr.id = 'trPestana2' + evento.id;
                    tabla.appendChild(tr);
                });
            } else {
                console.error('Error al obtener los eventos');
            }
        } catch (error) {
            console.error('Error: ', error);
        }
    }else if(tabName === 'Desplegable3'){
        const table = document.querySelector('#Desplegable3 table');
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const th = row.querySelector('th');
            if (!th) {
                row.remove();
            }
        });
        try {
            const response = await fetch('http://localhost:3000/eventos/misFavoritos?id='+ encodeURIComponent(idUsuario), {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

            if (response.ok) {
                const data = await response.json();
                data.eventos.forEach(evento => {
                    const tabla = document.querySelector('#Desplegable3 table');
                    const tr = document.createElement('tr');
                    const tdName = document.createElement('td');
                    const link = document.createElement('a');
                    link.textContent = evento.nombre;
                    link.href = 'detallesEvento.html?id=' + evento.id;
                    tdName.appendChild(link);
                    const tdFechaIni = document.createElement('td');
                    tdFechaIni.textContent = evento.fechaini;
                    const tdFechaFin = document.createElement('td');
                    tdFechaFin.textContent = evento.fechafin;
                    const tdLugar = document.createElement('td');
                    tdLugar.textContent = evento.lugar;
                    const tdDescripcion = document.createElement('td');
                    tdDescripcion.textContent = evento.descripcion;
                    const tdInvitacion = document.createElement('td');
                    const button = document.createElement('button');
                    button.textContent = 'Eliminar';                   
                    button.classList.add('EliminarFavorito');
                    button.id = 'buttonPestana3' + evento.id +"_"+ evento.idUsuario;
                    button.addEventListener('click', eliminarFavorito);
                    tdInvitacion.appendChild(button);
                    tr.appendChild(tdName);
                    tr.appendChild(tdFechaIni);
                    tr.appendChild(tdFechaFin);
                    tr.appendChild(tdLugar);
                    tr.appendChild(tdDescripcion);
                    tr.appendChild(tdInvitacion);
                    tr.id = 'trPestana3' + evento.id;
                    tabla.appendChild(tr);
                });
            } else {
                console.error('Error al obtener los eventos');
            }
        } catch (error) {
            console.error('Error: ', error);
        }
    }
}

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
            idUsuario = data.idUsuario;
        } else {
            console.error('Error al obtener el usuario');
        }
    } catch (error) {
        console.error('Error: ', error);
    }
    document.querySelector('.pestana').click();    
});

async function busqueda(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
        const querySel = document.querySelector('.active').id;
        const p = querySel === 'Desp1' ? 'Desplegable1' : (querySel === 'Desp2' ? 'Desplegable2' : 'Desplegable3');
        const pestana = querySel == 'Desp1' ? 'MisEventos' : (querySel == 'Desp2' ? 'Invitaciones' : 'Favoritos');
        const table = document.querySelector('#'+p+' table');
        const rows = table.querySelectorAll('tr');
        const token = localStorage.getItem('token');
        const texto = event.target.value;
        rows.forEach(row => {
            const th = row.querySelector('th');
            if (!th) {
                row.remove();
            }
        });
        try {
            const response = await fetch('http://localhost:3000/eventos/buscar?pestana='+pestana+'&id='+encodeURIComponent(idUsuario)+'&texto='+encodeURIComponent(texto), {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

            if (response.ok) {
                const data = await response.json();
                data.invitaciones.forEach(evento => {
                    const tabla = document.querySelector('#'+p+' table');
                    const tr = document.createElement('tr');
                    const tdName = document.createElement('td');
                    const link = document.createElement('a');
                    link.textContent = evento.nombre;
                    link.href = 'detallesEvento.html?id=' + evento.id;
                    tdName.appendChild(link);
                    const tdFechaIni = document.createElement('td');
                    tdFechaIni.textContent = evento.fechaini;
                    const tdFechaFin = document.createElement('td');
                    tdFechaFin.textContent = evento.fechafin;
                    const tdLugar = document.createElement('td');
                    tdLugar.textContent = evento.lugar;
                    const tdDescripcion = document.createElement('td');
                    tdDescripcion.textContent = evento.descripcion;
                    const tdEliminar = document.createElement('td');
                    if(p == 'Desplegable1'){
                        const button = document.createElement('button');
                        button.textContent = 'Eliminar';                   
                        button.classList.add('eliminar');
                        button.id = 'buttonPestana1' + evento.id +"_"+ evento.idUsuario;
                        button.addEventListener('click', eliminarEvento);
                        tdEliminar.appendChild(button);
                    }else if(p == 'Desplegable2'){
                        const selector = document.createElement('select');
                        const option1 = document.createElement('option');
                        option1.value = 'Pending';
                        option1.textContent = 'Pendiente';
                        const option2 = document.createElement('option');
                        option2.value = 'Acceptado';
                        option2.textContent = 'Aceptado';
                        const option3 = document.createElement('option');
                        option3.value = 'Rechazado';
                        option3.textContent = 'Rechazado';
                        selector.appendChild(option1);
                        selector.appendChild(option2);
                        selector.appendChild(option3);
                        selector.selectedIndex = evento.status === 'Pending' ? 0 : (evento.status === 'Acceptado' ? 1 : 2);
                        tdEliminar.appendChild(selector);
                    }
                    else if(p == 'Desplegable3'){
                        const button = document.createElement('button');
                        button.textContent = 'Eliminar';                   
                        button.classList.add('EliminarFavorito');
                        button.id = 'buttonPestana3' + evento.id +"_"+ evento.idUsuario;
                        button.addEventListener('click', eliminarFavorito);
                        tdEliminar.appendChild(button);
                    }
                    tr.appendChild(tdName);
                    tr.appendChild(tdFechaIni);
                    tr.appendChild(tdFechaFin);
                    tr.appendChild(tdLugar);
                    tr.appendChild(tdDescripcion);
                    tr.appendChild(tdEliminar);
                    tr.id = 'trPestana1' + evento.id;
                    tabla.appendChild(tr);
                });
            } else {
                console.error('Error al obtener los eventos');
            }
        } catch (error) {
            
        }
    }
}

const busquedas = document.querySelectorAll('.busqueda');
busquedas.forEach(b => {
    b.addEventListener('keyup', busqueda);
});