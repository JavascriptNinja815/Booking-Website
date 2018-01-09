angular
    .module('vliegdutch')
    .controller('ResultsController', ['$scope', '$filter', '$anchorScroll', 'Flight', 'Location', '$stateParams',
        function ($scope, $filter, $anchorScroll, Flight, Location, $stateParams) {

            $scope.searchOptions = $stateParams;
            $scope.flights = null;
            $scope.stopsFilters = {};
            $scope.filters = {};
            $scope.flightsPerPage = 10;
            $scope.sortProperty = 'price';

            Flight.search($scope.searchOptions, function (data) {
                $scope.flights = data;
            });

            $scope.showSort = function () {
                $scope.showSortModal = true;
            };//

            $scope.sortBy = function (property) {
                $scope.sortProperty = property;
                $scope.showSortModal = false;
                $anchorScroll('results-page');
            };

            $scope.showMore = function () {
                $scope.flightsPerPage += 10;
            };

            /**
             * @param {object} flight
             * @param {object} flight.general.overchargedPrice
             * @param {object} flight.forwardSector.durationMinutes
             * @param {object} flight.comebackSector.durationMinutes
             * @returns {*}
             */
            $scope.sortFlights = function (flight) {
                switch ($scope.sortMode) {
                    case 'cheapest':
                        return flight.general.overchargedPrice;
                    case 'quickest':
                        return flight.forwardSector.durationMinutes + flight.comebackSector.durationMinutes;
                    case 'best':
                        return flight.general.overchargedPrice * (flight.forwardSector.durationMinutes + flight.comebackSector.durationMinutes);
                }
            };

            $scope.showFilters = function (type) {
                $scope.showFiltersModal = true;
                $scope.filtersTab = type;
            };

            $scope.hideFilters = function () {
                $scope.showFiltersModal = false;
                $scope.filtersTab = null;
            };


            /**
             * @param {object} flight
             * @param flight.forwardSegments
             * @param flight.comebackSegments
             * @param n
             * @returns {boolean}
             * @private
             */
            var _hasStops = function (flight, n) {
                if (flight.comebackSegments.length === 0)
                    return flight.forwardSegments.length === (n + 1);

                return flight.forwardSegments.length === (n + 1) && flight.comebackSegments.length === (n + 1);
            };

            /**
             * @param {object} flight
             * @returns {boolean}
             * @private
             */
            var _stopsFilter = function (flight) {
                if (!$scope.filters.stops) return true;

                return (
                    ($scope.filters.stops.direct && _hasStops(flight, 0))
                    || ($scope.filters.stops.oneStop && _hasStops(flight, 1))
                    || ($scope.filters.stops.twoStops && _hasStops(flight, 2))
                );
            };

            /**
             * @param flight
             * @param flight.forwardSector.departureTime
             * @param flight.forwardSector.arrivalTime
             * @param flight.comebackSector.departureTime
             * @param flight.comebackSector.arrivalTime
             * @returns {boolean}
             * @private
             */
            var _timesFilter = function (flight) {
                if (!$scope.filters.times) return true;

                var f = $scope.filters.times;

                if (flight.forwardSector.durationMinutes < f.duration[0]
                    || flight.forwardSector.durationMinutes > f.duration[1]
                    || flight.comebackSector.durationMinutes < f.duration[0]
                    || flight.comebackSector.durationMinutes > f.duration[1])
                    return false;

                var isBetween = function (date, range) {
                    if (!range) return true;

                    var m = moment(date);
                    var min = moment(m).startOf('day').add(range[0], 'minutes');
                    var max = moment(m).startOf('day').add(range[1], 'minutes');

                    return m.isBetween(min, max);
                };

                if (!isBetween(flight.forwardSector.departureTime, f.takeOffForward)) return false;
                if (!isBetween(flight.forwardSector.arrivalTime, f.landingForward)) return false;

                if (flight.comebackSector.length > 0) {
                    if (!isBetween(flight.comebackSector.departureTime, f.takeOffComeback)) return false;
                    if (isBetween(flight.comebackSector.arrivalTime, f.landingComeback)) return false;
                }
                return true;
            };

            /**
             * @param flight
             * @param flight.forwardSector.arrivalAirport
             * @param flight.forwardSector.departureAirport
             * @param flight.comebackSector.arrivalAirport
             * @param flight.comebackSector.departureAirport
             * @returns {boolean}
             * @private
             */
            var _airportsFilter = function (flight) {
                if (!$scope.filters.airports) return true;

                var flightAirports = [
                    flight.forwardSector.arrivalAirport,
                    flight.forwardSector.departureAirport,
                    flight.comebackSector.arrivalAirport,
                    flight.comebackSector.departureAirport
                ];

                for (var i in flightAirports) {
                    if ($scope.filters.airports.unchecked.indexOf(flightAirports[i]) !== -1)
                        return false;
                }

                return true;
            };

            /**
             * @param flight
             * @returns {boolean}
             * @private
             */
            var _airlinesFilter = function (flight) {
                if (!$scope.filters.airlines) return true;

                var result = true,
                    segments = flight.forwardSegments.concat(flight.comebackSegments);

                for (var i = 0; i < segments.length; i++) {
                    result = !$scope.filters.airlines.unchecked.some(function (c) {
                        return c === segments[i].carrier;
                    });
                    if (!result) break;
                }

                return result;
            };

            /**
             * @param flight
             * @param flight.general.nightTransfer
             * @param flight.general.overnightFlight
             * @param flight.general.shortStopover
             * @returns {boolean}
             */
            var _qualityFilter = function (flight) {
                if (!$scope.filters.quality) return true;

                var result = true;
                if (!$scope.filters.quality.overnightLayover && flight.general.nightTransfer) result = false;
                if (!$scope.filters.quality.overnightFlight && flight.general.overnightFlight) result = false;
                if (!$scope.filters.quality.shortStopover && flight.general.shortStopover) result = false;

                return result;
            };

            $scope.filterFlights = function (flight) {
                if (!$scope.filters) return true;

                var stopsResult = _stopsFilter(flight);
                var timesResult = _timesFilter(flight);
                var airportsResult = _airportsFilter(flight);
                var airlinesResult = _airlinesFilter(flight);
                var qualityResult = _qualityFilter(flight);

                return stopsResult && timesResult && airportsResult && airlinesResult && qualityResult;
            };

            $scope.applyFilters = function (filtersData) {
                $scope.filters = filtersData;
                $scope.showFiltersModal = false;
                $anchorScroll('results-page');
            };
        }]);
