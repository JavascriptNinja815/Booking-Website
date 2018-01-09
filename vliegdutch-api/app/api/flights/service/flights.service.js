"use strict";

const async = require('async');

const FlightsModel = require('../../../models/').Flights;

const FlightsHelper = require('../../../helpers/').Flights;

const mapper = require('../../../util').Mapper;


const HOLIDAY_CITIES = ['NCE', 'MLA', 'BCN', 'SKG', 'TPS', 'LCA', 'CAG', 'ALC', 'AYT', 'PMI', 'LPA', 'IBZ', 'FAO',
    'TCI', 'ACE', 'FUE', 'CFU', 'CHQ', 'PFO', 'HER', 'HRG', 'VAR', 'RHO', 'BXN', 'FNC', 'KGS', 'SSH', 'BOJ'];

const LONG_DISTANCE_CITIES = ['NYC', 'LAX', 'YTO', 'BJS', 'SHA', 'BOS', 'DEL', 'BKK', 'WAS', 'CHI', 'MIA', 'HKG',
    'TYO', 'SIN', 'OSA', 'SFO', 'JNB', 'SYD'];

const PRICE_CALENDAR_PROPERTIES = ['departure_city.name', 'arrival_city.name', 'carriers', 'stops', 'departure_date',
    'duration', 'price.amount_display', 'departure_city.code', 'arrival_city.code', 'comeback_date'];


module.exports = {

    /**
     * @type function
     * @access public
     * @param req
     * @param res
     * @param next
     * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
     * @description Get prices calendar.
     */
    getPricesCalendar: (req, res, next) => {
        const query = req.query;

        let arrivalCity = query.arrivalCity;
        switch (query.type) {
            case 'holiday':
                arrivalCity = HOLIDAY_CITIES;
                break;
            case 'long_distance':
                arrivalCity = LONG_DISTANCE_CITIES;
                break;
        }

        // holiday & long distance cases
        if (Array.isArray(arrivalCity)) {
            async.map(arrivalCity, (city, callback) => {
                query.arrivalCity = city;
                FlightsModel.getPricesCalendar(query, callback);
            }, (err, results) => {
                if (err) next(err);
                else {
                    // filter result - null
                    const nonEmptyResults = results.filter((result) => result);
                    // remove not used properties
                    const response = mapper.mapPropertiesFromArrayOfObjects(nonEmptyResults, PRICE_CALENDAR_PROPERTIES);
                    res.json(response);
                }
            });
        }
        else { // hot fares, price calendar cases
            async.waterfall([
                (callback) => {
                    FlightsModel.getPricesCalendar(query, callback);
                }
            ], (err, result) => {
                if (err) next(err);
                else {
                    // compute duration (used for price calendar cases)
                    let response = FlightsHelper.computeDuration(result);
                    // remove not used properties
                    response = mapper.mapPropertiesFromArrayOfObjects(response, PRICE_CALENDAR_PROPERTIES);
                    res.json(response);
                }
            });
        }
    },

    /**
     * @type function
     * @access public
     * @param req
     * @param res
     * @param next
     * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
     * @description Search flights.
     */
    search: (req, res, next) => {
        const query = req.query;

        async.waterfall([
            (callback) => {
                FlightsModel.search(query, callback);
            }
        ], (err, result) => {
            if (err) next(err);
            else {
                async.map(result, FlightsHelper.sanitizedFlight, (err, flights) => {
                    if (err) next(err);
                    else res.json(flights);
                });
            }
        });
    },

    /**
     * @type function
     * @access public
     * @param req
     * @param res
     * @param next
     * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
     * @description Cheapest flights.
     */
    cheapest: (req, res, next) => {
        const query = req.query;

        async.waterfall([
            (callback) => {
                FlightsModel.cheapest(query, callback);
            }
        ], (err, result) => {
            if (err) next(err);
            else {
                if (req.query.arrivalCity || req.query.arrivalAirport)
                    res.json(FlightsHelper.sanitizeCheapestForCalendar(result));
                else {
                    async.map(result, FlightsHelper.sanitizeCheapestForPopular, (err, flights) => {
                        if (err) next(err);
                        else res.json(flights);
                    });
                }
            }
        });
    },

    /**
     * @type function
     * @access public
     * @param req
     * @param res
     * @param next
     * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
     * @description Flight alert.
     */
    alert: (req, res, next) => {
        const uid = req.body.uid,
            email = req.body.email;

        async.waterfall([
            (callback) => {
                FlightsModel.alert(uid, email, callback);
            }
        ], (err, result) => {
            if (err) next(err);
            else res.json(result);
        });
    }
};