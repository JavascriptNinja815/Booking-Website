"use strict";

const request = require('request');

const COMMON_DEPARTURES = [
    {
        "id": "city-AMS",
        "countryCode": "NL",
        "cityCode": "AMS",
        "value": "Amsterdam, Netherlands",
        "countryName": "Netherlands",
        "cityName": "Amsterdam"
    },
    {
        "id": "city-EIN",
        "countryCode": "NL",
        "cityCode": "EIN",
        "value": "Eindhoven, Netherlands",
        "countryName": "Netherlands",
        "cityName": "Eindhoven"
    },
    {
        "id": "city-DUS",
        "countryCode": "DE",
        "cityCode": "DUS",
        "value": "Dusseldorf, Germany",
        "countryName": "Germany",
        "cityName": "Dusseldorf"
    },
    {
        "id": "city-BRU",
        "countryCode": "BE",
        "cityCode": "BRU",
        "value": "Brussels, Belgium",
        "countryName": "Belgium",
        "cityName": "Brussels"
    },
    {
        "id": "airport-NRN",
        "cityId": "2259",
        "cityCode": "DUS",
        "countryCode": "DE",
        "cityName": "Dusseldorf",
        "countryName": "Germany",
        "value": "Weeze, Germany"
    }
];


module.exports = {

    /**
     * @type function
     * @access public
     * @param {string} code
     * @param {string} language
     * @param {function} callback
     * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
     * @description Returns information about an airport.
     */
    getAirport: (code, language, callback) => {
        request.get(_airportURL(code, language), (err, response, body) => {
            let result = null;
            if (!err && response.statusCode === 200) {
                const locations = JSON.parse(body);

                // find the desired one
                locations.some((location) => {
                    if (location.id === `city-${code}`) {
                        result = location;
                        return true;
                    }
                });

                if (!result) {
                    locations.some((location) => {
                        if (location.id === `airport-${code}`) {
                            result = location;
                            return true;
                        }
                    });
                }
            }
            callback(err, result);
        });
    },

    /**
     * @type function
     * @access public
     * @param {string} code
     * @param {string} language
     * @param {string} type
     * @param {function} callback
     * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
     * @description Returns information about locations.
     */
    search: (code, language, type, callback) => {
        request.get(_searchURL(code, language, type), (err, response, body) => {
            let result = {};
            if (!err && response.statusCode === 200) {
                result = JSON.parse(body);

                // eliminate if cityCode is not defined.
                if (type === 'cities') {
                    result = result.filter((location) => {
                        return location['cityCode'];
                    });
                }
            }
            callback(err, result);
        });
    },

    /**
     * @type function
     * @access public
     * @param {function} callback
     * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
     * @description Returns information about common departures.
     */
    getCommonDepartures: (callback) => {
        callback(null, COMMON_DEPARTURES);
    }
};


/**
 * @type function
 * @param {string} code
 * @param {string} language
 * @returns {string}
 * @private
 * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
 * @description Generates url to get airport.
 */
function _airportURL(code, language) {
    let url = 'https://vliegdutch.waavo.com/static/autocompletei.php?type=flights';
    url += "&language=" + (language || 'eng');
    url += "&term=" + code;

    return url;
}


/**
 * @type function
 * @param {string} code
 * @param {string} language
 * @param {string} type
 * @returns {string}
 * @private
 * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
 * @description Generates search url.
 */
function _searchURL(code, language, type) {
    let url = 'https://vliegdutch.waavo.com/static/autocompletei.php';
    url += "?type=" + (type || 'flights');
    url += "&language=" + (language || 'eng');
    url += "&term=" + code;

    return url;
}