const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/crear', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const {nombre, descripcion, lugar, fechaini, fechafin, participantes, idUsuario} = req.body;
    try{
        const response = await axios.post('http://registrar_eventos:4000/eventos/registrar', {
            nombre,
            descripcion,
            lugar,
            fechaini,
            fechafin,
            participantes: participantes,
            idUsuario: idUsuario
        },{
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        res.status(response.status).json(response.data);
    } catch (error){
        if(error.response){
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({message: 'A ocurrido un error'});
        }
    }
});
router.get('/misEventos', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const id = req.query.id;
    try{
        const response = await axios.get('http://registrar_eventos:4000/eventos/' + encodeURIComponent(id), {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        res.status(response.status).json(response.data);
    } catch (error){
        if(error.response){
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({message: 'A ocurrido un error'});
        }
    }
});
router.post('/borrar', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const idEvento = req.query.idEvento;
    try{
        const response = await axios.post('http://registrar_eventos:4000/eventos/eliminar/' + encodeURIComponent(idEvento), {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        res.status(response.status).json(response.data);
    } catch (error){
        if(error.response){
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({message: 'A ocurrido un error'});
        }
    }
});
router.get('/buscar', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const { pestana, id, texto } = req.query;
    try {
        const response = await axios.get('http://registrar_eventos:4000/buscar/Eventos/'+pestana+'/'+id+'/'+encodeURIComponent(texto), {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ message: 'A ocurrido un error' });
        }
    }
});
router.get('/detalle', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const idEvento = req.query.idEvento;
    try{
        const response = await axios.get('http://registrar_eventos:4000/evento/' + encodeURIComponent(idEvento), {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        const idUsuario = response.data.idUsuario;
        const response2 = await axios.get('http://autentify:8000/autentificacion/usuarioId/' + encodeURIComponent(idUsuario), {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        response.data.correo = response2.data.correo;
        const response3 = await axios.get('http://registrar_eventos:4000/evento/invitados/' + encodeURIComponent(idEvento), {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        response.data.invitados = response3.data.invitados;
        res.status(response.status).json(response.data);
    } catch (error){
        if(error.response){
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({message: 'A ocurrido un error'});
        }
    }
});
router.post('/agregarFavorito', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const idEvento = req.query.idEvento;
    //obtener ususario logeado
    try{
        const response = await axios.get('http://autentify:8000/autentificacion/user', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        const idUsuario = response.data.idUsuario;
        const response2 = await axios.post('http://registrar_eventos:4000/eventos/favoritos/agregar/' + encodeURIComponent(idUsuario)+'/'+ encodeURIComponent(idEvento), {}, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        res.status(response2.status).json(response2.data);
    } catch (error){
        if(error.response){
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({message: 'A ocurrido un error'});
        }
    }
});
router.get('/invitaciones', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const id = req.query.id;
    try{
        const response = await axios.get('http://registrar_eventos:4000/eventos/invitados/' + encodeURIComponent(id), {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        res.status(response.status).json(response.data);
    } catch (error){
        if(error.response){
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({message: 'A ocurrido un error'});
        }
    }
});
router.get('/misFavoritos', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const id = req.query.id;
    try{
        const response = await axios.get('http://registrar_eventos:4000/eventos/favoritos/' + encodeURIComponent(id), {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        res.status(response.status).json(response.data);
    } catch (error){
        if(error.response){
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({message: 'A ocurrido un error'});
        }
    }
});
router.post('/eliminarFavorito', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const idEvento = req.query.idEvento;
    //obtener ususario logeado
    try{
        const response = await axios.get('http://autentify:8000/autentificacion/user', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        const idUsuario = response.data.idUsuario;
        const response2 = await axios.post('http://registrar_eventos:4000/eventos/favoritos/eliminar/' + encodeURIComponent(idUsuario)+'/'+ encodeURIComponent(idEvento), {}, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        res.status(response2.status).json(response2.data);
    } catch (error){
        if(error.response){
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({message: 'A ocurrido un error'});
        }
    }
});
router.post('/updateInvite', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const idEvento = req.query.idEvento;
    const invitado = req.query.invitado;
    const accion = "AnyadirInvitados";
    const campo = "invitados";
    try{
        const usuario = await axios.get('http://autentify:8000/autentificacion/usuarioCorreo/'+encodeURIComponent(invitado), {
            headers:{
                'Authorization': 'Bearer ' + token
            }
        });
        if (!usuario.data || !usuario.data.idUsuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        const id_usuario = usuario.data.idUsuario;
        const cambio = id_usuario.toString();
        const response = await axios.put('http://evento_update:5000/evento-update/update/'+idEvento,{
        id_usuario,
        accion,
        cambio,
        campo
        },{
        headers: {
            'Authorization': 'Bearer ' + token
        }
        });
        res.status(response.status).json(usuario.data);
    }catch(error){
        if(error.response){
            res.status(error.response.status).json(error.response.data);
        }else{
            res.status(500).json({mensaje: 'A ocurrido un error'});
        }
    }
});
router.post('/updateUninvite', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const idEvento = req.query.idEvento;
    const invitado = req.query.invitado;
    const accion = "eliminarInvitados";
    const campo = "invitados";
    try{
        const usuario = await axios.get('http://autentify:8000/autentificacion/usuarioCorreo/'+encodeURIComponent(invitado), {
            headers:{
                'Authorization': 'Bearer ' + token
            }
        });
        if (!usuario.data || !usuario.data.idUsuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        const id_usuario = usuario.data.idUsuario;
        const cambio = id_usuario.toString();
        const response = await axios.put('http://evento_update:5000/evento-update/update/'+idEvento,{
        id_usuario,
        accion,
        cambio,
        campo
        },{
        headers: {
            'Authorization': 'Bearer ' + token
        }
        });
        res.status(response.status).json(response.data);
    }catch(error){
        if(error.response){
            res.status(error.response.status).json(error.response.data);
        }else{
            res.status(500).json({mensaje: 'A ocurrido un error'});
        }
    }
});

router.post('/updateEvento', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const idEvento = req.query.idEvento;
    const email = req.query.idUsuario;
    const campo = req.query.campo;
    const cambio = req.query.cambio;
    const accion = "modificar";
    try{
        const usuario = await axios.get('http://autentify:8000/autentificacion/usuarioCorreo/'+encodeURIComponent(email), {
            headers:{
                'Authorization': 'Bearer ' + token
            }
        });
        if (!usuario.data || !usuario.data.idUsuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        const id_usuario = usuario.data.idUsuario;
        const response = await axios.put('http://evento_update:5000/evento-update/update/'+idEvento,{
            id_usuario,
            accion,
            cambio,
            campo
        },{
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        res.status(response.status).json(response.data);
    } catch(error){
        if(error.response){
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({message: 'A ocurrido un error'});
        }
    }
});
router.post('/deshacer', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const idEvento = req.query.idEvento;
    try{
        const response = await axios.post('http://evento_update:5000/evento-update/deshacer/'+encodeURIComponent(idEvento), {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        res.status(response.status).json(response.data);
    } catch (error){
        if(error.response){
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({message: 'A ocurrido un error'});
        }
    }
});

router.post('/invitacion', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const idEvento = req.query.idEvento;
    const idUsuario = req.query.idUsuario;
    const status = req.query.status;
    console.log("IdEvento: " + idEvento + ", idUsuario :" + idUsuario);
    try{
        const response = await axios.post('http://evento_update:5000/evento-update/respuestaInvitacion/'+encodeURIComponent(idEvento), {
            id_usuario: idUsuario,
            respuesta: status
        },{
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        res.status(response.status).json(response.data);
    } catch (error){
        if(error.response){
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({message: 'A ocurrido un error'});
        }
    }
});
module.exports = router;