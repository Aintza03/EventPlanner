const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/listaNotificacion', async (req, res) => {
    const token = req.headers.authorization;
    let idUsuario; 
    try {
        const usuario = await axios.get('http://autentify:8000/autentificacion/user', {
            headers: {
                Authorization: token
            }
        });
        idUsuario = usuario.data.idUsuario;
        console.log("ID USUARIO: " + idUsuario); 

        const response = await axios.get('http://notify:6000/notify/notificaciones/' + encodeURIComponent(idUsuario), {
            headers: {
                Authorization: token
            }
        });
        let notificaciones = response.data.map(notificacion => notificacion.descripcion);
        res.status(200).json({ notificaciones });
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ message: 'A ocurrido un error' });
        }
    }
});

module.exports = router;