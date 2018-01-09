"use strict";

const router = require('express').Router();

const LocationsMiddle = require('../../middleware/').Locations;

const LocationsSVC = require('./service/locations.service');


/**
 * @swagger
 * /locations/airport:
 *   get:
 *     tags:
 *       - locations
 *     description: List all relevant airports.
 *     operationId: listAirports
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: code
 *         description: The code of the location. Ex. - AMS, DUS...
 *         in: query
 *         required: true
 *         type: string
 *       - name: language
 *         description: The language code. Supports - eng, est, lav, lit, ron, rus. Defaults to `eng`.
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully listed.
 *       400:
 *         description: Invalid input.
 *         schema:
 *           $ref: '#/definitions/ErrorResponse'
 *       500:
 *         description: Internal error.
 *         schema:
 *           $ref: '#/definitions/ErrorResponse'
 */
router.get('/airport',
    LocationsMiddle.validateGetAirportArgs, (req, res, next) => {

        LocationsSVC.getAirport(req, res, next);
    });


/**
 * @swagger
 * /locations/search:
 *   get:
 *     tags:
 *       - locations
 *     description: List all relevant locations.
 *     operationId: listLocations
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: code
 *         description: The code of the location. Ex. - AMS, DUS...
 *         in: query
 *         required: true
 *         type: string
 *       - name: language
 *         description: The language code. Supports - eng, est, lav, lit, ron, rus. Defaults to `eng`.
 *         in: query
 *         required: false
 *         type: string
 *       - name: type
 *         description: The type of the query. Supports - flights, cities. Defaults to `flights`.
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully listed.
 *       400:
 *         description: Invalid input.
 *         schema:
 *           $ref: '#/definitions/ErrorResponse'
 *       500:
 *         description: Internal error.
 *         schema:
 *           $ref: '#/definitions/ErrorResponse'
 */
router.get('/search',
    LocationsMiddle.validateSearchArgs, (req, res, next) => {

        LocationsSVC.search(req, res, next);
    });


/**
 * @swagger
 * /locations/common-departures:
 *   get:
 *     tags:
 *       - locations
 *     description: List all common departures.
 *     operationId: listCommonDepartures
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully listed.
 *       500:
 *         description: Internal error.
 *         schema:
 *           $ref: '#/definitions/ErrorResponse'
 */
router.get('/common-departures', (req, res, next) => {

    LocationsSVC.getCommonDepartures(req, res, next);
});


module.exports = router;


/**
 * @swagger
 * definitions:
 *
 *   ErrorResponse:
 *     type: object
 *     properties:
 *       errorStatus:
 *         type: integer
 *       errorCode:
 *         type: string
 *       errorMessage:
 *         type: string
 */
