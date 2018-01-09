"use strict";

/**
 * @description Joi validation:
 *  This JSDoc is used mainly for WebStorm.
 * @type {*}
 */
const Joi = require('joi');


module.exports = {

    /**
     * @description Get airport args.
     */
    getAirport: {
        query: {
            code: Joi.string().max(20).required(),
            language: Joi.string().valid('eng', 'est', 'lav', 'lit', 'ron', 'rus')
        }
    },

    /**
     * @description Search args.
     */
    search: {
        query: {
            code: Joi.string().max(20).required(),
            language: Joi.string().valid('eng', 'est', 'lav', 'lit', 'ron', 'rus'),
            type: Joi.string().valid('flights', 'cities')
        }
    }
};