const express = require('express');
const axios = require('axios');
const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    const { nombreUsuario, contrasena, correo } = req.body;

    try {
        // Forward the request to the microservice
        const data = {
            nombreUsuario: nombreUsuario,
            contrasena: contrasena,
            correo: correo
        };
        const response = await axios.post('http://autentify:8000/autentificacion/register', data);
        // Return the response from the microservice
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            // Generic error
            res.status(500).json({ message: 'A ocurrido un error' });
        }
    }
});

module.exports = router;