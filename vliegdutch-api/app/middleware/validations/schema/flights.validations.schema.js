"use strict";

/**
 * @description Joi validation:
 *  This JSDoc is used mainly for WebStorm.
 * @type {*}
 */
const Joi = require('joi');

module.exports = {

    /**
     * @description Get prices calendar args.
     */
    getPricesCalendar: {
        query: {
            roundTrip: Joi.boolean(),
            departureCity: Joi.string().max(20),
            departureAirport: Joi.string().max(20),
            arrivalCity: Joi.string().max(20),
            arrivalAirport: Joi.string().max(20),
            type: Joi.string().valid('holiday', 'long_distance'),
            departureDate: Joi.string().max(25),
            comebackDate: Joi.string().max(25),
            supplier: Joi.string().max(200),
            duration: Joi.string().max(50),
            adults: Joi.number().integer().positive(),
            children: Joi.number().integer().min(0),
            babies: Joi.number().integer().min(0)
        }
    },

    /**
     * @description Get search args.
     */
    search: {
        query: {
            departureCity: Joi.string().max(20).required(),
            departureAirport: Joi.string().max(20),
            arrivalCity: Joi.string().max(20).required(),
            arrivalAirport: Joi.string().max(20),
            departureDate: Joi.string().max(25).required(),
            comebackDate: Joi.string().max(25),
            adults: Joi.number().integer().positive(),
            children: Joi.number().integer().min(0),
            babies: Joi.number().integer().min(0)
        }
    },

    /**
     * @description Add alert args.
     */
    alert: {
        body: {
            uid: Joi.string().max(30).required(),
            email: Joi.string().email().required()
        }
    }
};