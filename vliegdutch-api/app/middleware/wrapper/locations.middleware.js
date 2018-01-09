"use strict";

/**
 * @description Joi validation:
 *  This JSDoc is used mainly for WebStorm.
 * @type {*}
 */
const Joi = require('joi');

const LocationsValidationsSchema = require('../validations/').LocationsValidationsSchema;

const ValidationErrorHandler = require('../../util/').ValidationErrorHandler;


module.exports = {

    /**
     * @type function
     * @access public
     * @param req
     * @param res
     * @param next
     * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
     * @description Check the arguments for get airport.
     */
    validateGetAirportArgs: (req, res, next) => {
        Joi.validate({query: req.query}, LocationsValidationsSchema.getAirport, {
            abortEarly: true,
            allowUnknown: false
        }, (err) => {
            if (err) return ValidationErrorHandler.handleError(err, res);

            next();
        });
    },

    /**
     * @type function
     * @access public
     * @param req
     * @param res
     * @param next
     * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
     * @description Check the arguments for search.
     */
    validateSearchArgs: (req, res, next) => {
        Joi.validate({query: req.query}, LocationsValidationsSchema.search, {
            abortEarly: true,
            allowUnknown: false
        }, (err) => {
            if (err) return ValidationErrorHandler.handleError(err, res);

            next();
        });
    }
};