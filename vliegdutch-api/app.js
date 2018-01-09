"use strict";

const path = require('path');

const bodyParser = require('body-parser'),
    compression = require('compression'),
    express = require('express'),
    morgan = require('morgan');

const headers = require('./app/config/').Headers;

const api = require('./app/api/api');

const app = express();


/**
 * @description Serve static files.
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * @description Log each request (except for production).
 * @property app.get()
 */
app.get('env') !== 'production' && app.use(morgan('dev'));

/**
 * @description Middleware - compression.
 */
app.use(compression());

/**
 * @description Middleware - body parser:
 * 1. Parses the text as URL encoded data.
 * 2. Parses the text as JSON & exposes the resulting object on req.body.
 */
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/**
 * @description Set headers.
 */
headers.setHeaders(app);

/**
 * @description Initialize api
 */
app.use('/', api);

/**
 * @description Catch 404 and forward to error handler.
 */
app.use((req, res, next) => {
    let err = new Error('NOT_FOUND');
    err.status = 404;
    next(err);
});

/**
 * @description Error handler (middleware).
 */
app.use((err, req, res, next) => {

    res.status(err.status || 500).json({
        statusCode: err.status || 500,
        errorCode: err.name || 'InternalError',
        errorMessage: err.message || 'The server encountered an internal error. Please retry the request.'
    });
});


module.exports = app;