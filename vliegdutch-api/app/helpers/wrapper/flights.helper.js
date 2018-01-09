"use strict";

const async = require('async'),
    moment = require('moment');

const LocationsModel = require('../../models/').Locations;


module.exports = {

    /**
     * @type function
     * @access public
     * @description Sanitize Flights.
     */
    sanitizedFlight: _sanitizedFlight,

    /**
     * @type function
     * @access public
     * @param {{comeback_date, departure_date, duration} []} results
     * @description Compute duration for round trip.
     */
    computeDuration: (results) => {
        return results.map((result) => {
            if (result.comeback_date) {
                const departure = moment(result.departure_date);
                const comeback = moment(result.comeback_date);
                result.duration = comeback.diff(departure, 'days');
            }
            return result;
        });
    },

    /**
     * @type function
     * @access public
     * @param {{comeback_date, departure_date, price} []} results
     * @returns {Array}
     * @description Sanitize Cheapest for Calendar.
     */
    sanitizeCheapestForCalendar: (results) => {
        let response = [];
        results.forEach((result) => {
            response.push({
                departureDate: result && result.departure_date,
                comebackDate: result && result.comeback_date,
                price: result && result.price && result.price.amount_display
            });
        });

        return response;
    },

    /**
     * @type function
     * @access public
     * @param {object} flight
     * @param {object} flight.arrival_city
     * @param {string} flight.departure_date
     * @param {string} flight.arrival_date
     * @param {{amount_display}} flight.price
     * @param {function} callback
     * @returns {Array}
     * @description Sanitize Cheapest for Popular.
     */
    sanitizeCheapestForPopular: (flight, callback) => {
        async.waterfall([
            (c) => {
                LocationsModel.getAirport(flight.arrival_city.code, '', c);
            }
        ], (err, city) => {
            if (err) {
                callback(err, null);
                return;
            }

            const response = {
                countryCode: city && city.countryCode,
                countryName: city && city.countryName,
                cityCode: city && city.cityCode,
                cityName: city && city.cityName,
                cityImage: flight && flight.arrival_city && flight.arrival_city.image,
                departureDate: flight && flight.departure_date,
                arrivalDate: flight && flight.arrival_date,
                price: flight && flight.price && flight.price.amount_display
            };
            callback(null, response);
        });
    }
};


/**
 * @type function
 * @param {object} flight
 * @param {object} flight.forwardSector
 * @param {array} flight.comebackSegments
 * @param {object} flight.comebackSector
 * @param {array} flight.forwardSegments
 * @param {object} flight.general
 * @param {function} callback
 * @private
 * @param {number} flight.price
 * @param {string} flight.priceRound
 * @param {number || string} flight.priceCents
 * @param {number} flight.quickestIndex
 * @param {number} flight.bestIndex
 */
function _sanitizedFlight(flight, callback) {

    _reformatPrice(flight);

    _addShortTimes(flight.forwardSector);
    _normalizeDuration(flight.forwardSector);
    if (flight.comebackSegments.length > 0) {
        _addShortTimes(flight.comebackSector);
        _normalizeDuration(flight.comebackSector);
    }

    _addIndexes(flight);

    flight.leftPlaces = Number.MAX_VALUE;
    flight.forwardSegments.map((segment, i) => {
        if (segment.leftPlaces) flight.leftPlaces = Math.min(flight.leftPlaces, segment.leftPlaces);
        _normalizeDuration(segment);
        _addShortTimes(segment);
        if (flight.forwardSegments[i + 1]) _addLayoverDuration(segment, flight.forwardSegments[i + 1]);
    });
    if (flight.comebackSegments.length > 0) {
        flight.comebackSegments.map((segment, i) => {
            if (segment.leftPlaces) flight.leftPlaces = Math.min(flight.leftPlaces, segment.leftPlaces);
            _normalizeDuration(segment);
            _addShortTimes(segment);
            if (flight.comebackSegments[i + 1]) _addLayoverDuration(segment, flight.comebackSegments[i + 1]);
        });
    }
    if (flight.leftPlaces === Number.MAX_VALUE) flight.leftPlaces = null;

    _addOvernightStopover(flight);


    let asyncTasks = [
        (callback) => {
            _addCityName(flight.forwardSector, callback);
        },
        (callback) => {
            async.map(flight.forwardSegments, _addCityName, callback);
        }
    ];
    if (flight.comebackSegments.length > 0) {
        asyncTasks = asyncTasks.concat([
            (callback) => {
                _addCityName(flight.comebackSector, callback);
            },
            (callback) => {
                async.map(flight.comebackSegments, _addCityName, callback);
            }
        ]);
    }
    async.series(asyncTasks, (err) => {
        callback(err, flight);
    });
}


/**
 * @type function
 * @param {object} flight
 * @param {object} flight.general
 * @param {number} flight.general.overchargedPrice - 20.18
 * @private
 * @param {number} flight.price - 20.18
 * @param {string} flight.priceRound - '20'
 * @param {number || string} flight.priceCents - 18
 * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
 * @description Reformat price.
 */
function _reformatPrice(flight) {
    const price = (flight.general.overchargedPrice).toString().split('.');
    flight.price = flight.general.overchargedPrice;
    flight.priceRound = price[0];

    const priceCents = parseInt(price[1], 10);
    priceCents
        ? flight.priceCents = priceCents > 9 ? priceCents : `0${priceCents}`
        : flight.priceCents = '00';
}


/**
 * @type function
 * @param {object} sector - forwardSector, comebackSector
 * @param {string} sector.departureTime - '2017-06-11 15:00:00'
 * @param {string} sector.arrivalTime - '2017-06-11 16:45:00'
 * @private
 * @param {string} sector.shortDepartureTime - '15:00'
 * @param {string} sector.shortArrivalTime - '16:45'
 * @param {number} sector.daysDiff - 0
 * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
 * @description Add short times.
 */
function _addShortTimes(sector) {
    let departureTimeMoment = moment(sector.departureTime),
        arrivalTimeMoment = moment(sector.arrivalTime);

    sector.shortDepartureTime = departureTimeMoment.format('HH:mm');
    sector.shortArrivalTime = arrivalTimeMoment.format('HH:mm');

    departureTimeMoment.isSame(arrivalTimeMoment, 'day')
        ? sector.daysDiff = 0
        : sector.daysDiff = arrivalTimeMoment.startOf('day').diff(departureTimeMoment.startOf('day'), 'days');
}


/**
 * @type function
 * @param {object} sector - forwardSector, comebackSector
 * @param {string} sector.duration - '01:45:00'
 * @private
 * @param {number} sector.durationMinutes - 105
 * @param {string} sector.duration - '1h 45m'
 * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
 * @description Normalize duration.
 */
function _normalizeDuration(sector) {
    sector.durationMinutes = moment.duration(sector.duration).asMinutes();
    sector.duration = _minutesToHHMM(sector.durationMinutes);
}


/**
 * @type function
 * @param {number} minutes - 105
 * @returns {string}
 * @private
 * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
 * @description Minutes to HHMM.
 */
function _minutesToHHMM(minutes) {
    return (minutes / 60 >= 1) ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes % 60}m`;
}


/**
 * @type function
 * @param {object} flight
 * @param {object} flight.forwardSector
 * @param {object} flight.comebackSector
 * @param {array} flight.comebackSegments
 * @param {number} flight.forwardSector.durationMinutes - 105
 * @param {number} flight.comebackSector.durationMinutes - 0
 * @param {object} flight.general
 * @param {number} flight.general.overchargedPrice - 20.18
 * @private
 * @param {number} flight.quickestIndex - 105
 * @param {number} flight.bestIndex - 2118.9
 * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
 * @description Add indexes.
 */
function _addIndexes(flight) {
    flight.quickestIndex = flight.forwardSector.durationMinutes;
    if (flight.comebackSegments.length > 0) flight.quickestIndex += flight.comebackSector.durationMinutes;

    flight.bestIndex = flight.general.overchargedPrice * flight.quickestIndex;
}


/**
 * @type function
 * @param {object} segment
 * @param {object} nextSegment
 * @param {string} segment.arrivalTime - '2017-06-11 21:25:00'
 * @param {string} nextSegment.departureTime - '2017-06-12 18:00:00'
 * @private
 * @param {string} segment.layoverDuration - '20h 35m'
 * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
 * @description Add layover duration.
 */
function _addLayoverDuration(segment, nextSegment) {
    const arrivalTimeMoment = moment(segment.arrivalTime),
        departureTimeMoment = moment(nextSegment.departureTime);
    const duration = departureTimeMoment.diff(arrivalTimeMoment, 'minutes');

    segment.layoverDuration = _minutesToHHMM(duration);
}

/**
 * @type function
 * @param {object} flight
 * @param {array} flight.forwardSegments
 * @param {array} flight.comebackSegments
 * @private
 * @param {boolean} flight.general.overnightFlight
 * @param {boolean} flight.general.shortStopover
 * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
 * @description Add layover duration.
 */
function _addOvernightStopover(flight) {
    let overnightFlight = false,
        shortStopover = false;
    let departureTimeMoment, arrivalTimeMoment;

    flight.forwardSegments.concat(flight.comebackSegments).forEach((segment) => {
        departureTimeMoment = moment(segment.departureTime);
        arrivalTimeMoment = moment(segment.arrivalTime);
        if (!departureTimeMoment.isSame(arrivalTimeMoment, 'day')) overnightFlight = true;
        if (departureTimeMoment.diff(arrivalTimeMoment, 'minutes') <= 40) shortStopover = true;
    });

    flight.general.overnightFlight = overnightFlight;
    flight.general.shortStopover = shortStopover;
}

/**
 * @type function
 * @param {object} sector
 * @param {function} callback
 * @private
 * @author Albert Hambardzumyan <hambardzumyan.albert@gmail.com>
 * @description Add city name.
 */
function _addCityName(sector, callback) {
    async.parallel([
        (c) => {
            LocationsModel.getAirport(sector.arrivalAirport, '', c);
        },
        (c) => {
            LocationsModel.getAirport(sector.departureAirport, '', c);
        }
    ], (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }

        sector.arrivalCity = results && results[0] && results[0]['cityName'];
        sector.departureCity = results && results[1] && results[1]['cityName'];
        callback(null, sector);
    });
}