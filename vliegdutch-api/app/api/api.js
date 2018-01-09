"use strict";

const express = require('express');

const API_CONFIG = require('./config/api.config');
const SWAGGER_CONFIG = require('./config/swagger.config');

// require all APIs
const flights = require('./flights/flights.api'),
    locations = require('./locations/locations.api');

const router = express.Router(),
    app = express();

const basePath = `/api/${API_CONFIG.API_VERSION}`;


/**
 * @description Initialize swagger.
 */
const APIs = ['./app/api/**/*.js'];
const swaggerSpec = SWAGGER_CONFIG.init(basePath, APIs);
app.get('/swagger.json', (req, res) => {
    res.json(swaggerSpec);
});


/**
 * @description Initialize routes.
 */
router.use(basePath, app);

// add required APIs
app.use('/flights', flights);
app.use('/locations', locations);


module.exports = router;