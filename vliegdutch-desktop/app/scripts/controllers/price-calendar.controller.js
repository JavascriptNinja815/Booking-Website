angular
    .module('vliegdutch')
    .controller('PriceCalendarController', ['$scope', '$state', '$stateParams', '$timeout', 'Location', 'Flight', 'Helpers',
        function ($scope, $state, $stateParams, $timeout, Location, Flight, Helpers) {
            $scope.results = null;
            $scope.type = $stateParams.type;
            $scope.departureCity = $stateParams.departureCity || 'EIN';
            $scope.arrivalCity = $stateParams.arrivalCity;
            $scope.duration = $stateParams.duration;
            $scope.roundTrip = $stateParams.roundTrip ? $stateParams.roundTrip === 'true' : true;
            $scope.departureDate = $stateParams.departureDate;
            $scope.comebackDate = $stateParams.comebackDate;

            var initialLocations = {
                departure: null,
                arrival: null
            };

            $scope.travelPeriodDate = function (type, format) {
                if ($scope.travelPeriodSlider)
                    return moment().add($scope.travelPeriodSlider[type], 'days').format(format);
            };

            $scope.doSearch = function (setUrl) {

                if (!setUrl) return;
                if ($scope.departureCity) {
                    $scope.results = null;

                    var urlOptions = {};
                    var departureDate = $scope.travelPeriodDate('min', 'YYYY-MM-DD');
                    var comebackDate = $scope.travelPeriodDate('max', 'YYYY-MM-DD');
                    var searchOptions = {
                        type: $scope.type,
                        roundTrip: $scope.roundTrip,
                        departureCity: $scope.departureCity,
                        arrivalCity: $scope.arrivalCity,
                        duration: $scope.durationSlider.min + '|' + $scope.durationSlider.max,
                        departureDate: departureDate + '|' + comebackDate
                    };
                    angular.copy(searchOptions, urlOptions);

                    if ($scope.roundTrip) {
                        urlOptions.comebackDate = comebackDate;
                        searchOptions.comebackDate = departureDate + '|' + comebackDate;
                    }

                    if (setUrl) {
                        $state.go('price_calendar', urlOptions, {
                            notify: false
                        });
                    }

                    Flight.pricesCalendar(searchOptions, function (data) {
                        $scope.results = data;
                    });
                }
            };

            $scope.resetTravelPeriodSlider = function () {
                var minDate = moment();
                var maxDate = moment().add(1, 'year');
                var max = maxDate.diff(minDate, 'days');

                $scope.travelPeriodSlider = {
                    min: 0,
                    max: max,
                    options: {
                        floor: 0,
                        ceil: max,
                        step: 1,
                        minRange: 5,
                        pushRange: true,
                        onEnd: function () {
                            $scope.doSearch(true);
                        }
                    }
                };
            };

            $scope.resetDurationSlider = function () {
                var duration = [0, 100];
                if ($scope.duration) {
                    duration = $scope.duration.split('|').map(function (i) {
                        return parseInt(i, 10);
                    });
                }

                $scope.durationSlider = {
                    min: duration[0] || 1,
                    max: duration[1] || 100,
                    options: {
                        floor: 0,
                        ceil: 100,
                        step: 1,
                        minRange: 0,
                        pushRange: true,
                        onEnd: function () {
                            $scope.doSearch(true);
                        }
                    }
                };
            };

            $scope.reset = function () {
                Location.getAirport({code: $scope.departureCity}, function (data) {
                    $scope.departureLocation = data;
                    initialLocations.departure = data;
                });

                if ($scope.arrivalCity) {
                    Location.getAirport({code: $scope.arrivalCity}, function (data) {
                        $scope.arrivalLocation = data;
                        initialLocations.arrival = data;
                    });
                }

                $scope.resetTravelPeriodSlider();
                $scope.resetDurationSlider();

                $scope.doSearch();
            };

            $scope.reset();

            /**
             * @type function
             * @param {object} location
             * @param location.airportCode
             * @param location.airportName
             * @param location.cityName
             * @param location.cityCode
             * @returns {string}
             */
            $scope.locationName = function (location) {
                if (location) {
                    return location.airportCode === 'NRN'
                        ? location.airportName + ' (' + location.airportCode + ')'
                        : location.cityName + ' (' + location.cityCode + ')';
                }
            };

            var searchLocationsDelay = null;
            var searchLocations = function (q, type) {
                if (q && q.length >= 3) {
                    $scope.locationsResults = [];
                    var codeLowerCase = q.toLowerCase();
                    if (codeLowerCase === 'nrn' || codeLowerCase === 'wee' || codeLowerCase === 'weez' || codeLowerCase === 'weeze') {
                        Location.getAirport({code: 'NRN'}).$promise.then(function (data) {
                            $scope[type + 'LocationsResults'] = [data];
                        });
                    }
                    else {
                        Location.search({type: 'cities', code: q}).$promise.then(function (data) {
                            $scope[type + 'LocationsResults'] = data;
                        });
                    }
                }
            };

            $scope.$watch('locationQuery', function (q) {
                if (searchLocationsDelay) $timeout.cancel(searchLocationsDelay);
                searchLocationsDelay = $timeout(function () {
                    searchLocations(q);
                }, 1500);
            });

            $scope.$watch('departureLocationQuery', function (q) {
                if (searchLocationsDelay) $timeout.cancel(searchLocationsDelay);
                if (q && q.length >= 3) {
                    $scope.departureLocationsResults = [];
                    searchLocationsDelay = $timeout(function () {
                        searchLocations(q, 'departure');
                    }, 100);
                }
                else $scope.departureLocationsResults = null;
            });

            $scope.departureLocationModel = function (q) {
                if (arguments.length > 0) $scope.departureLocationQuery = q;
                else return $scope.locationName($scope.departureLocation) || $scope.departureLocationQuery;
            };

            $scope.$watch('arrivalLocationQuery', function (q) {
                if (searchLocationsDelay) $timeout.cancel(searchLocationsDelay);
                if (q && q.length >= 3) {
                    $scope.arrivalLocationsResults = [];
                    searchLocationsDelay = $timeout(function () {
                        searchLocations(q, 'arrival');
                    }, 100);
                }
                else $scope.arrivalLocationsResults = null;
            });

            $scope.arrivalLocationModel = function (q) {
                if (arguments.length > 0) $scope.arrivalLocationQuery = q;
                else return $scope.locationName($scope.arrivalLocation) || $scope.arrivalLocationQuery;
            };

            $scope.validateLocation = function (type) {
                $scope[type + 'Location'] = initialLocations[type];
                $scope[type + 'City'] = initialLocations[type] && initialLocations[type].cityCode;
                $timeout(function () {
                    if (!$scope[type + 'City']) {
                        $scope[type + 'LocationQuery'] = null;
                    }
                }, 200);
                $scope.doSearch(true);
            };

            $scope.focusLocation = function (type) {
                $scope[type + 'Location'] = null;
            };

            $scope.setLocation = function (type, location) {
                if (type === 'departure') {
                    $scope.departureLocationQuery = null;
                    $scope.departureLocation = location;
                    $scope.departureCity = location.cityCode;
                } else {
                    $scope.arrivalLocationQuery = null;
                    $scope.arrivalLocation = location;
                    $scope.arrivalCity = location.cityCode;
                }

                $scope.type = null;
                $scope.doSearch(true);
            };

            $scope.setRoundTrip = function (val) {
                $scope.roundTrip = val;
                $scope.resetTravelPeriodSlider();
                $scope.doSearch(true);
            };
            $scope.setRoundTrip(false);

            $scope.flipDestinations = function () {
                var departureCity = $scope.departureCity;
                $scope.departureCity = $scope.arrivalCity;
                $scope.arrivalCity = departureCity;

                var departureLocation = $scope.departureLocation;
                $scope.departureLocation = $scope.arrivalLocation;
                $scope.arrivalLocation = departureLocation;

                $scope.doSearch(true);
            };

            $scope.currentFlight = null;
            $scope.searchByFlight = function (flight) {
                $scope.currentFlight = flight;
                $scope.showPassengersModal = true;
            };

            /**
             * @param {number} stop
             * @returns {string}
             * @description Sanitize stops value, select css.
             */
            $scope.sanitizeStops = function (stop) {
                return Helpers.sanitizeStops(stop);
            };
            $scope.selectStopsCSS = function (stop) {
                if (stop === 0) return 'stopovers';
                return stop === 1 ? 'oneStop' : 'moreStops'
            };
        }]);
