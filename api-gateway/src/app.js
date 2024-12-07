const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const authController = require('./controllers/authentificationController');
const registerController = require('./controllers/registerController');
const modController = require('./controllers/modController');
const eventosController = require('./controllers/eventos');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from UserInterface directory
app.use(express.static(path.join(__dirname, 'UserInterface')));
// Routes
app.use('/autentificacionLog', authController);
app.use('/autentificacionReg', registerController);
app.use('/autentificacionMod', modController);
app.use('/eventos', eventosController);
// Start the server
app.listen(port, () => {
    console.log('Server running at http://localhost:' + port);
});