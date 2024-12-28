const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const eventosController = require('./controllers/eventosController');
const usuarioController = require('./controllers/usuarioController');
const app = express();
const port = process.env.PORT || 3000;
const openApiSpec = YAML.load(path.join(__dirname, '..', 'OpenApi', 'openapi.yaml'));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
// Serve static files from UserInterface directory
app.use(express.static(path.join(__dirname, 'UserInterface')));
// Routes
app.use('/usuarios', usuarioController);
app.use('/eventos', eventosController);

// Start the server
app.listen(port, () => {
    console.log('Server running at http://localhost:' + port);
});