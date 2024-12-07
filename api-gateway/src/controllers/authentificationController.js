const express = require('express');
const axios = require('axios');
const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
    const { nombreUsuario, contrasena } = req.body;

    try {
        // Forward the request to the microservice
        const response = await axios.post('http://autentify:8000/autentificacion/login', {
            nombreUsuario,
            contrasena
        });

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