"use strict";

const router = require('express').Router();

const FlightsMiddle = require('../../middleware/').Flights;

const FlightsSVC = require('./service/flights.service');


/**
 * @swagger
 * /flights/prices-calendar:
 *   get:
 *     tags:
 *       - flights
 *     description: List prices-calendar.
 *     operationId: listPricesCalendar
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: roundTrip
 *         description: Set true for round trips. Defaults to false.
 *         in: query
 *         required: false
 *         type: string
 *       - name: departureCity
 *         description: Departure City code.
 *         in: query
 *         required: false
 *         type: string
 *       - name: departureAirport
 *         description: Departure Airport code.
 *         in: query
 *         required: false
 *         type: string
 *       - name: arrivalCity
 *         description: Arrival City code.
 *         in: query
 *         required: false
 *         type: string
 *       - name: arrivalAirport
 *         description: Arrival Airport code.
 *         in: query
 *         required: false
 *         type: string
 *       - name: type
 *         description: Special type which overrides the arrivalCity property. Supports - holiday or long_distance.
 *         in: query
 *         required: false
 *         type: string
 *       - name: departureDate
 *         description: Departure Date or Date range joined by |. Ex. - 2017-11-01 or 2017-12-01|2017-12-20.
 *         in: query
 *         required: false
 *         type: string
 *         format: date
 *       - name: comebackDate
 *         description: Comeback Date or Date range joined by |. Ex. - 2017-11-01 or 2017-12-01|2017-12-20.
 *         in: query
 *         required: false
 *         type: string
 *         format: date
 *       - name: supplier
 *         description: Supplier or suppliers list joined by |. Ex. - ryanair or ryanair|wizzair|airbaltic
 *         in: query
 *         required: false
 *         type: string
 *       - name: duration
 *         description: If round trip is true then duration range is joined by |. Defaults to '1|14'.
 *         in: query
 *         required: false
 *         type: string
 *       - name: adults
 *         description: Number of Adults. Defaults to 1.
 *         in: query
 *         required: false
 *         type: integer
 *       - name: children
 *         description: Number of Children.
 *         in: query
 *         required: false
 *         type: integer
 *       - name: babies
 *         description: Number of Babies.
 *         in: query
 *         required: false
 *         type: integer
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
router.get('/prices-calendar',
    FlightsMiddle.validateGetPricesCalendarArgs, (req, res, next) => {

        FlightsSVC.getPricesCalendar(req, res, next);
    });


/**
 * @swagger
 * /flights/search:
 *   get:
 *     tags:
 *       - flights
 *     description: Flights search.
 *     operationId: flightsSearch
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: departureCity
 *         description: Departure City code.
 *         in: query
 *         required: true
 *         type: string
 *       - name: departureAirport
 *         description: Departure Airport code.
 *         in: query
 *         required: false
 *         type: string
 *       - name: arrivalCity
 *         description: Arrival City code.
 *         in: query
 *         required: true
 *         type: string
 *       - name: arrivalAirport
 *         description: Arrival Airport code.
 *         in: query
 *         required: false
 *         type: string
 *       - name: departureDate
 *         description: Departure Date or Date range joined by |. Ex. - 2017-11-01 or 2017-12-01|2017-12-20.
 *         in: query
 *         required: true
 *         type: string
 *         format: date
 *       - name: comebackDate
 *         description: Comeback Date or Date range joined by |. Ex. - 2017-11-01 or 2017-12-01|2017-12-20.
 *         in: query
 *         required: false
 *         type: string
 *         format: date
 *       - name: adults
 *         description: Number of Adults. Defaults to 1.
 *         in: query
 *         required: false
 *         type: integer
 *       - name: children
 *         description: Number of Children.
 *         in: query
 *         required: false
 *         type: integer
 *       - name: babies
 *         description: Number of Babies.
 *         in: query
 *         required: false
 *         type: integer
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
    FlightsMiddle.validateSearchArgs, (req, res, next) => {

        FlightsSVC.search(req, res, next);
    });


/**
 * @swagger
 * /flights/cheapest:
 *   get:
 *     tags:
 *       - flights
 *     description: Flights cheapest.
 *     operationId: flightsCheapest
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: roundTrip
 *         description: Set true for round trips. Defaults to false.
 *         in: query
 *         required: false
 *         type: string
 *       - name: departureCity
 *         description: Departure City code.
 *         in: query
 *         required: false
 *         type: string
 *       - name: departureAirport
 *         description: Departure Airport code.
 *         in: query
 *         required: false
 *         type: string
 *       - name: arrivalCity
 *         description: Arrival City code.
 *         in: query
 *         required: false
 *         type: string
 *       - name: arrivalAirport
 *         description: Arrival Airport code.
 *         in: query
 *         required: false
 *         type: string
 *       - name: type
 *         description: Special type which overrides the arrivalCity property. Supports - holiday or long_distance.
 *         in: query
 *         required: false
 *         type: string
 *       - name: departureDate
 *         description: Departure Date or Date range joined by |. Ex. - 2017-11-01 or 2017-12-01|2017-12-20.
 *         in: query
 *         required: false
 *         type: string
 *         format: date
 *       - name: comebackDate
 *         description: Comeback Date or Date range joined by |. Ex. - 2017-11-01 or 2017-12-01|2017-12-20.
 *         in: query
 *         required: false
 *         type: string
 *         format: date
 *       - name: supplier
 *         description: Supplier or suppliers list joined by |. Ex. - ryanair or ryanair|wizzair|airbaltic
 *         in: query
 *         required: false
 *         type: string
 *       - name: duration
 *         description: If round trip is true then duration range is joined by |. Defaults to '1|14'.
 *         in: query
 *         required: false
 *         type: string
 *       - name: adults
 *         description: Number of Adults. Defaults to 1.
 *         in: query
 *         required: false
 *         type: integer
 *       - name: children
 *         description: Number of Children.
 *         in: query
 *         required: false
 *         type: integer
 *       - name: babies
 *         description: Number of Babies.
 *         in: query
 *         required: false
 *         type: integer
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
router.get('/cheapest', (req, res, next) => {

    FlightsSVC.cheapest(req, res, next);
});


router.post('/alert',
    FlightsMiddle.validateAddAlertArgs, (req, res, next) => {

        FlightsSVC.alert(req, res, next);
    });


module.exports = router;