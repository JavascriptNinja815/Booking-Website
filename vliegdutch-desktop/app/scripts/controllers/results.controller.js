angular
    .module('vliegdutch')
    .controller('ResultsController', ['$scope', '$filter', 'Flight', 'Location', '$stateParams', 'Helpers', 'toastr',
        function ($scope, $filter, Flight, Location, $stateParams, Helpers, toastr) {
            $scope.searchOptions = $stateParams;
            $scope.flights = null;
            $scope.stopsFilters = {};
            $scope.filters = {};
            $scope.sortProperty = 'price';
            $scope.flightsPerPage = 20;
            $scope.showPriceMatrix = true;

            Flight.search($scope.searchOptions, function (data) {
                $scope.flights = data;
            });

            $scope.showSort = function () {
                $scope.showSortModal = true;
            };

            $scope.sortBy = function (property) {
                $scope.sortProperty = property;
                $scope.showSortModal = false;
            };

            $scope.showMore = function () {
                $scope.flightsPerPage += 10;
            };

            $scope.togglePriceMatrix = function () {
                $scope.showPriceMatrix = !$scope.showPriceMatrix;
            };

            $scope.pricePerPassenger = 'Price for ' + Helpers.sanitizePassengersCount($scope.searchOptions);
            $scope.seatsLeft = function (seatsLeft) {
                return Helpers.sanitizeSeatsLeft(seatsLeft);
            };

            /**
             * @type function
             * @param {object} flight
             * @param {object} flight.general
             * @param {object} flight.forwardSector
             * @param {object} flight.comebackSector
             * @param flight.general.overchargedPrice
             * @param flight.forwardSector.durationMinutes
             * @param flight.comebackSector.durationMinutes
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

            var hasStops = function (flight, n) {
                if (flight.comebackSegments.length === 0) return flight.forwardSegments.length === (n + 1);
                else return (flight.forwardSegments.length === (n + 1) && flight.comebackSegments.length === (n + 1));
            };

            var stopsFilter = function (flight) {
                if (!$scope.filters.stops) return true;

                return (
                    ($scope.filters.stops.direct && hasStops(flight, 0))
                    || ($scope.filters.stops.oneStop && hasStops(flight, 1))
                    || ($scope.filters.stops.twoStops && hasStops(flight, 2))
                );
            };

            var durationFilter = function (flight) {
                if (!$scope.filters.duration) return true;

                var duration = $scope.filters.duration;

                if (flight.comebackSegments.length === 0)
                    return (flight.forwardSector.durationMinutes >= duration[0]
                    && flight.forwardSector.durationMinutes <= duration[1]);
                else {
                    return (
                    flight.forwardSector.durationMinutes >= duration[0]
                    && flight.forwardSector.durationMinutes <= duration[1]
                    && flight.comebackSector.durationMinutes >= duration[0]
                    && flight.comebackSector.durationMinutes <= duration[1]);
                }
            };

            var timesFilter = function (flight) {
                if (!$scope.filters.times) return true;

                var f = $scope.filters.times;

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
                    if (!isBetween(flight.comebackSector.arrivalTime, f.landingComeback)) return false;
                }

                return true;
            };

            var airportsFilter = function (flight) {
                if (!$scope.filters.airports) return true;

                var flightAirports = [
                    flight.forwardSector.arrivalAirport,
                    flight.forwardSector.departureAirport
                ];

                if (flight.comebackSector.length > 0) {
                    flightAirports = flightAirports.concat([
                        flight.comebackSector.arrivalAirport,
                        flight.comebackSector.departureAirport
                    ]);
                }

                for (var i in flightAirports) {
                    if ($scope.filters.airports.unchecked.indexOf(flightAirports[i]) !== -1)
                        return false;
                }

                return true;
            };

            var layoverAirportsFilter = function (flight) {
                if (!$scope.filters.layoverAirports) return true;

                var uncheckedFilters = $scope.filters.layoverAirports.unchecked;

                if (uncheckedFilters.length > 0 &&
                    (flight.forwardSegments.length === 1 || flight.comebackSegments.length === 1))
                    return false;

                var result = true;
                var checkAirport = function (segment) {
                    if (uncheckedFilters.indexOf(segment.arrivalAirport) !== -1)
                        result = false;
                };

                flight.forwardSegments
                    .slice(0, flight.forwardSegments.length - 1)
                    .forEach(checkAirport);

                if (result || flight.comebackSegments.length === 0) return result;

                flight.comebackSegments
                    .slice(0, flight.comebackSegments.length - 1)
                    .forEach(checkAirport);

                return result;
            };

            var airlinesFilter = function (flight) {
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
             * @param flight.general
             * @param flight.general.nightTransfer
             * @param flight.general.overnightFlight
             * @param flight.general.shortStopover
             * @returns {boolean}
             */
            var qualityFilter = function (flight) {
                if (!$scope.filters.quality) return true;

                var result = true;
                if (!$scope.filters.quality.overnightLayover && flight.general.nightTransfer) result = false;
                if (!$scope.filters.quality.overnightFlight && flight.general.overnightFlight) result = false;
                if (!$scope.filters.quality.shortStopover && flight.general.shortStopover) result = false;

                return result;
            };

            $scope.filterFligts = function (flight) {
                if (!$scope.filters) return true;

                var stopsResult = stopsFilter(flight);
                var durationResult = durationFilter(flight);
                var timesResult = timesFilter(flight);
                var airportsResult = airportsFilter(flight);
                var layoverAirportsResult = layoverAirportsFilter(flight);
                var airlinesResult = airlinesFilter(flight);
                var qualityResult = qualityFilter(flight);

                return stopsResult && durationResult && timesResult &&
                    airportsResult && layoverAirportsResult &&
                    airlinesResult && qualityResult;
            };

            /**
             * @description Subscribe for Lower Price Alert.
             */
            $scope.alertModel = {};
            $scope.alert = function (uuid) {
                Flight.alert({
                    uid: uuid,
                    email: $scope.alertModel.email
                }, function (data) {
                    data.message === 'OK'
                        ? toastr.success('Successfully subscribed!')
                        : toastr.error('Something goes wrong!');
                });
            };

            /**
             * @description Get prices matrix data.
             */
            var formatDate = function (m) {
                return m.format('YYYY-MM-DD');
            };

            var departureDateMin = moment($scope.searchOptions.departureDate).subtract(2, 'day');
            var departureDateMax = moment($scope.searchOptions.departureDate).add(3, 'days');
            var departureDate = formatDate(departureDateMin) + '|' + formatDate(departureDateMax);

            var comebackDate = null;
            if ($scope.searchOptions.comebackDate) {
                var comebackDateMin = moment($scope.searchOptions.comebackDate).subtract(2, 'day');
                var comebackDateMax = moment($scope.searchOptions.comebackDate).add(3, 'days');
                comebackDate = formatDate(comebackDateMin) + '|' + formatDate(comebackDateMax);
            }

            var options = {
                departureCity: $scope.searchOptions.departureCity,
                arrivalCity: $scope.searchOptions.arrivalCity,
                adults: $scope.searchOptions.adults,
                children: $scope.searchOptions.children,
                babies: $scope.searchOptions.babies,
                departureDate: departureDate,
                comebackDate: comebackDate,
                roundTrip: !!$scope.searchOptions.comebackDate
            };
            Flight.pricesCalendar(options, function (data) {
                $scope.matrixPrices = data;
            });
        }]);
