"use strict";

const moment = require('moment'),
    request = require('request');


module.exports = {

    /**
     * @type function
     * @access public
     * @param {object} query
     * @param {function} callback
     * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
     * @description Returns information about a price calendar.
     */
    getPricesCalendar: (query, callback) => {
        request.get(_pricesCalendarURL(query), (err, response, body) => {
            let results = [];
            if (!err && response.statusCode === 200) {
                results = JSON.parse(body);

                // resolve 2d array to 1d for some cases
                if (query.type === 'holiday' || query.type === 'long_distance')
                    results = results[0];
            }
            callback(err, results);
        });
    },

    /**
     * @type function
     * @access public
     * @param {object} query
     * @param {function} callback
     * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
     * @description Search flights.
     */
    search: (query, callback) => {
        request.get(_searchURL(query), (err, response, body) => {
            let results = [];
            if (!err && response.statusCode === 200) {
                results = JSON.parse(body);
            }
            callback(err, results);
        });
    },

    /**
     * @type function
     * @access public
     * @param {object} query
     * @param {function} callback
     * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
     * @description Cheapest flights.
     */
    cheapest: (query, callback) => {
        request.get(cheapestURL(query), (err, response, body) => {
            let results = [];
            if (!err && response.statusCode === 200) {
                results = JSON.parse(body);
            }
            callback(err, results);
        });
    },

    /**
     * @type function
     * @access public
     * @param {string} uid
     * @param {string} email
     * @param {function} callback
     * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
     * @description Alert subscription.
     */
    alert: (uid, email, callback) => {
        const query = `https://vliegdutch.waavo.com/flights_alerts/book/?method=POST&data[FlightsPricesAlerts][cached_flights_uid]=${uid}&data[FlightsPricesAlerts][email]=${email}`;
        request.post(query, (err, response, body) => {
            let results = [];
            if (!err && response.statusCode === 200) {
                results = body;
            }
            callback(err, results);
        });
    }
};


/**
 * @type function
 * @param {object} query
 * @param {string} query.roundTrip
 * @param {string} query.departureAirport
 * @param {string} query.arrivalAirport
 * @param {string} query.departureCity
 * @param {string} query.arrivalCity
 * @param {string} query.departureDate
 * @param {string} query.comebackDate
 * @param {string} query.supplier
 * @param {string} query.duration
 * @param {string} query.adults
 * @param {string} query.children
 * @param {string} query.babies
 * @returns {string}
 * @private
 * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
 * @description Generates url for prices calendar.
 */
function _pricesCalendarURL(query) {
    let url = 'https://vliegdutch.waavo.com/webservice/flights_search/destinations_lowest';
    url += (query.roundTrip && query.roundTrip === 'true') ? '/round_trip:1' : '/round_trip:0';

    if (query.departureAirport) url += `/departure_airport:${query.departureAirport}`;
    if (query.arrivalAirport) url += `/arrival_airport:${query.arrivalAirport}`;
    if (query.departureCity) url += `/departure_city:${query.departureCity}`;
    if (query.arrivalCity) url += `/arrival_city:${query.arrivalCity}`;
    if (query.departureDate) url += `/departure_date:${query.departureDate}`;
    if (query.comebackDate) url += `/comeback_date:${query.comebackDate}`;
    if (query.supplier) url += `/supplier:${query.supplier}`;

    url += '/duration:' + (query.duration || "1|14");
    url += '/adults:' + (query.adults || 1);
    url += '/children:' + (query.children || 0);
    url += '/infants:' + (query.babies || 0);

    return url;
}

/**
 * @type function
 * @param {object} query
 * @param {string} query.departureCity
 * @param {string} query.departureAirport
 * @param {string} query.arrivalCity
 * @param {string} query.arrivalAirport
 * @param {string} query.departureDate
 * @param {string} query.comebackDate
 * @param {string} query.adults
 * @param {string} query.children
 * @param {string} query.babies
 * @returns {string}
 * @private
 * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
 * @description Generates url for search.
 */
function _searchURL(query) {
    let url = 'https://vliegdutch.waavo.com/webservice/flights_search/prices';

    if (query.departureCity) url += `/departure_city:${query.departureCity}`;
    if (query.departureAirport) url += `/departure_airport:${query.departureAirport}`;
    if (query.arrivalCity) url += `/arrival_city:${query.arrivalCity}`;
    if (query.arrivalAirport) url += `/arrival_airport:${query.arrivalAirport}`;
    url += `/departure_date:${query.departureDate}`;
    if (query.comebackDate) url += `/comeback_date:${query.comebackDate}`;

    url += '/adults:' + (query.adults || 1);
    url += '/children:' + (query.children || 0);
    url += '/infants:' + (query.babies || 0);

    return url;
}

/**
 * @type function
 * @param {object} query
 * @param {string} query.roundTrip
 * @param {string} query.departureAirport
 * @param {string} query.arrivalAirport
 * @param {string} query.departureCity
 * @param {string} query.arrivalCity
 * @param {string} query.departureDate
 * @param {string} query.comebackDate
 * @param {string} query.supplier
 * @param {string} query.duration
 * @param {string} query.adults
 * @param {string} query.children
 * @param {string} query.babies
 * @returns {string}
 * @private
 * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
 * @description Generates url for cheapest.
 */
function cheapestURL(query) {
    let url = 'https://vliegdutch.waavo.com/webservice/flights_search/destinations_lowest';
    url += (query.roundTrip && query.roundTrip === 'true') ? '/round_trip:1' : '/round_trip:0';

    if (query.departureAirport) url += '/departure_airport:' + query.departureAirport;
    if (query.arrivalAirport) url += '/arrival_airport:' + query.arrivalAirport;
    if (query.departureCity) url += '/departure_city:' + query.departureCity;
    if (query.arrivalCity) url += '/arrival_city:' + query.arrivalCity;
    if (query.departureDate) url += '/departure_date:' + query.departureDate;
    if (query.comebackDate) url += '/comeback_date:' + query.comebackDate;
    if (query.supplier) url += '/supplier:' + query.supplier;

    url += '/duration:' + (query.duration || "1|14");
    url += '/adults:' + (query.adults || 1);
    url += '/children:' + (query.children || 0);
    url += '/infants:' + (query.babies || 0);

    return url;
}