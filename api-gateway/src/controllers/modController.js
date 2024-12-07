const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/usuario', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]; // Extract the token from the Authorization header

    try {
        const response = await axios.get('http://autentify:8000/autentificacion/user', {
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

router.put('/actualizar', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const { contrasenaVieja, contrasenaNueva, contrasenaRepetida, correo } = req.body
    try {
        const response = await axios.put('http://autentify:8000/autentificacion/modify', {
            contrasenaVieja,
            contrasenaNueva,
            contrasenaRepetida,
            correo
        }, {
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

router.get('/usuarioCorreo', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const correo = req.query.correo;

    try {
        const response = await axios.get('http://autentify:8000/autentificacion/usuarioCorreo/' + encodeURIComponent(correo), {
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
module.exports = router;