"use strict";

const async = require('async');

const LocationsModel = require('../../../models/').Locations;


module.exports = {

    /**
     * @type function
     * @access public
     * @param req
     * @param res
     * @param next
     * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
     * @description Get airport.
     */
    getAirport: (req, res, next) => {
        const code = req.query.code,
            language = req.query.language;

        async.waterfall([
            (callback) => {
                LocationsModel.getAirport(code, language, callback);
            }
        ], (err, result) => {
            if (err) next(err);
            else res.json(result);
        });
    },

    /**
     * @type function
     * @access public
     * @param req
     * @param res
     * @param next
     * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
     * @description Search locations.
     */
    search: (req, res, next) => {
        const code = req.query.code,
            language = req.query.language,
            type = req.query.type;

        async.waterfall([
            (callback) => {
                LocationsModel.search(code, language, type, callback);
            }
        ], (err, result) => {
            if (err) next(err);
            else res.json(result);
        });
    },


    /**
     * @type function
     * @access public
     * @param req
     * @param res
     * @param next
     * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
     * @description Get common departures.
     */
    getCommonDepartures: (req, res, next) => {

        async.waterfall([
            (callback) => {
                LocationsModel.getCommonDepartures(callback);
            }
        ], (err, result) => {
            if (err) next(err);
            else res.json(result);
        });
    }
};