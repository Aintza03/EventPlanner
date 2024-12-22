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
                    selector.id = 'pestana2' + evento.id;
                    selector.addEventListener('change', invitacion);
                    const option1 = document.createElement('option');
                    option1.value = 'Pending';
                    option1.textContent = 'Pendiente';
                    const option2 = document.createElement('option');
                    option2.value = 'Aceptado';
                    option2.textContent = 'Aceptado';
                    const option3 = document.createElement('option');
                    option3.value = 'Rechazado';
                    option3.textContent = 'Rechazado';
                    selector.appendChild(option1);
                    selector.appendChild(option2);
                    selector.appendChild(option3);
                    selector.selectedIndex = evento.status === 'Pending' ? 0 : (evento.status === 'Aceptado' ? 1 : 2);
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
                        selector.id = 'pestana2' + evento.id;
                        selector.addEventListener('change', invitacion);
                        const option1 = document.createElement('option');
                        option1.value = 'Pending';
                        option1.textContent = 'Pendiente';
                        const option2 = document.createElement('option');
                        option2.value = 'Aceptado';
                        option2.textContent = 'Aceptado';
                        const option3 = document.createElement('option');
                        option3.value = 'Rechazado';
                        option3.textContent = 'Rechazado';
                        selector.appendChild(option1);
                        selector.appendChild(option2);
                        selector.appendChild(option3);
                        selector.selectedIndex = evento.status === 'Pending' ? 0 : (evento.status === 'Aceptado' ? 1 : 2);
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

async function invitacion(event){
    const token = localStorage.getItem('token');
    const selector = event.target;
    const opcion = selector.options[selector.selectedIndex].value;
    if(opcion === 'Pending'){
        return;
    }
    const selectorId = selector.id;
    const idEvento = selectorId.replace('pestana2', '');
    try{
        const response = await fetch('http://localhost:3000/eventos/invitacion?idEvento=' + encodeURIComponent(idEvento) + '&idUsuario='+ encodeURIComponent(idUsuario) +'&status=' + encodeURIComponent(opcion), {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        if(response.ok){
            const data = await response.json();
            if(opcion === 'Rechazado'){
                page.reload();
            }
        }else{
            console.error('Error al aceptar o rechazar la invitacion');
        }
    } catch (error){
        console.error('Error: ', error);
    }
}