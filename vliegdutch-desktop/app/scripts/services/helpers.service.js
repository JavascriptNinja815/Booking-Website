angular.module('vliegdutch').factory('Helpers', ['$filter', function ($filter) {

    return {

        /**
         * @type function
         * @param {{arrival_city}[]} array
         * @description Rename arrival city name (special case).
         */
        sanitizeArrivalName: function (array) {
            array.map(function (object) {
                if (object && object.arrival_city && object.arrival_city.name === 'Costa del Sol/Malaga')
                    object.arrival_city.name = 'Malaga';
            });
        },

        /**
         * @type function
         * @param {object} passengers
         * @param {number} passengers.adults
         * @param {number} passengers.children
         * @param {number} passengers.babies
         * @returns {string}
         * @description Generate a string from object of passengers.
         */
        sanitizePassengersCount: function (passengers) {
            var result = '';
            if (!passengers.adults) passengers.adults = 1;

            result += passengers.adults + ' ' + (passengers.adults > 1
                    ? $filter('translate')('SEARCH.ADULTS')
                    : $filter('translate')('SEARCH.ADULT'));
            if (passengers.children > 0)
                result += ', ' + passengers.children + ' ' + (passengers.children > 1
                        ? $filter('translate')('SEARCH.CHILDREN')
                        : $filter('translate')('SEARCH.CHILD'));
            if (passengers.babies > 0)
                result += ', ' + passengers.babies + ' ' + (passengers.babies > 1
                        ? $filter('translate')('SEARCH.BABIES')
                        : $filter('translate')('SEARCH.BABY'));

            return result;
        },

        /**
         * @type function
         * @param {number} seatsLeft
         * @returns {string}
         * @description Generate a string from seats number.
         */
        sanitizeSeatsLeft: function (seatsLeft) {
            var result = '';
            if (seatsLeft)
                result = seatsLeft + (seatsLeft > 1 ? ' seats left' : ' seat left');

            return result;
        },

        /**
         * @type function
         * @param {number} stop
         * @returns {string}
         * @description Generate a string from stops number.
         */
        sanitizeStops: function (stop) {
            if (stop === 0) return 'DIRECT';
            else if (stop >= 1) return stop + (stop === 1 ? ' STOP' : ' STOPS');
            else return '';
        }
    };
}]);