"use strict";

const localEnv = _loadLocalEnv(),
    env = process.env.NODE_ENV || 'development';


/**
 * @property {string} HOST
 * @property {string} PORT
 * @property {string} PROTOCOL
 * @property {object} DB
 */
const CONFIG = {

    development: {
        HOST: localEnv.HOST || '127.0.0.1',
        PORT: localEnv.PORT || '3000',
        PROTOCOL: localEnv.PROTOCOL || 'http'
    },

    production: {
        HOST: '185.92.86.226',
        PORT: '3000',
        PROTOCOL: 'http'
    }
};

module.exports = CONFIG[env];


/**
 * @type function
 * @returns {{}}
 * @private
 * @description Load .env.js file if such exists.
 */
function _loadLocalEnv() {
    let env = {};
    try {
        env = require('../../../.env');
    } catch (e) {
        if (e instanceof Error && e.code === 'MODULE_NOT_FOUND')
            console.log('.env is not specified.');
        else
            throw e;
    }
    return env;
}