angular.module('vliegdutch').directive('searchFormSec', ['$state', '$timeout', '$stateParams', '$filter', 'Flight', 'Location', 'Helpers',
    function ($state, $timeout, $stateParams, $filter, Flight, Location, Helpers) {

        return {
            restrict: 'E',
            templateUrl: 'views/search-form-2.html',
            link: function ($scope) {
                $scope.departureLocation = null;
                $scope.arrivalLocation = null;
                $scope.departureDate = $stateParams.departureDate;
                $scope.comebackDate = $stateParams.comebackDate;
                $scope.adults = parseInt($stateParams.adults) || 1;
                $scope.children = parseInt($stateParams.children) || 0;
                $scope.babies = parseInt($stateParams.babies) || 0;
                $scope.comebackDate ? $scope.mode = 'roundtrip' : $scope.mode = 'one-way';

                $scope.calendarPrices = [];
                $scope.calendar = [];

                $scope.setMode = function (mode) {
                    $scope.mode = mode;
                    if (mode === 'one-way') $scope.comebackDate = null;
                };

                var fillDepartureCity = function () {
                    var term = $stateParams.departureCity || $stateParams.departureAirport;
                    if (term) {
                        Location.getAirport({code: term}, function (data) {
                            $scope.departureLocation = data;
                        });
                    }
                };

                fillDepartureCity();

                var fillArrivalCity = function () {
                    var term = $stateParams.arrivalCity || $stateParams.arrivalAirport;
                    if (term) {
                        Location.getAirport({code: term}, function (data) {
                            $scope.arrivalLocation = data;
                        });
                    }
                };

                fillArrivalCity();

                $scope.loadingPopularDestinations = false;

                $scope.departureCalendarOptions = {
                    numberOfMonths: 2,
                    minDate: 0,
                    maxDate: $scope.comebackDate,
                    dateFormat: 'dd-mm-yy',
                    onSelect: function () {
                        $timeout(function () {
                            angular.element(document).find('#comeback-date').focus();
                        }, 100);
                    }
                };

                $scope.comebackCalendarOptions = function () {
                    return {
                        numberOfMonths: 2,
                        minDate: $scope.departureDate,
                        dateFormat: 'dd-mm-yy'
                    };
                };

                $scope.passengersSummary = function () {
                    return Helpers.sanitizePassengersCount({
                        adults: $scope.adults,
                        children: $scope.children,
                        babies: $scope.babies
                    });

                };

                $scope.incremenPassengers = function (type) {
                    if ($scope[type] < 10) $scope[type]++;
                };

                $scope.decrementPassengers = function (type) {
                    if ($scope[type] > (type === 'adults' ? 1 : 0)) $scope[type]--;
                };

                $scope.updatePassengers = function (type, n) {
                    $scope[type] = n;
                };

                $scope.locationName = function (location) {
                    if (location) return location.label;
                };

                var searchLocationsDelay = null;
                var searchLocations = function (q, type) {
                    if (q && q.length >= 3) {
                        $scope.locationsResults = [];
                        Location.search({code: q}).$promise.then(function (data) {
                            $scope[type + 'LocationsResults'] = data;
                        });
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

                $scope.activeAutocomplete = function (type) {
                    $scope[type + 'LocationOld'] = $scope[type + 'Location'];
                    $scope[type + 'Location'] = null;
                };

                $scope.validateLocation = function (type) {
                    $timeout(function () {
                        if (!$scope[type + 'Location'] || $scope[type + 'Location'] === '') {
                            $scope[type + 'LocationQuery'] = null;
                            $scope[type + 'Location'] = $scope[type + 'LocationOld'];
                        }
                    }, 200);
                };

                $scope.setLocation = function (type, location) {
                    if (type === 'departure') {
                        $scope.departureLocationQuery = null;
                        $scope.departureLocation = location;
                        angular.element(document).find('#arrival-location').focus();
                    } else {
                        $scope.arrivalLocationQuery = null;
                        $scope.arrivalLocation = location;
                        angular.element(document).find('#departure-date').focus();
                    }
                };

                var setSearchParamsLocation = function (options, type) {
                    var location = $scope[type + 'Location'].id.split('-');

                    if (location[0] === 'city') options[type + 'City'] = location[1];
                    else if (location[0] === 'airport') options[type + 'Airport'] = location[1];

                    return options;
                };


                $scope.doSearch = function () {
                    if ($scope.departureLocation && $scope.arrivalLocation && $scope.departureDate &&
                        ($scope.mode === 'one-way' || ($scope.mode === 'roundtrip' && $scope.comebackDate))) {
                        var options = {
                            departureDate: moment($scope.departureDate).format('YYYY-MM-DD'),
                            adults: $scope.adults || 1,
                            children: $scope.children || 0,
                            babies: $scope.babies || 0
                        };

                        options = setSearchParamsLocation(options, 'departure');
                        options = setSearchParamsLocation(options, 'arrival');

                        if ($scope.mode === 'roundtrip')
                            options.comebackDate = moment($scope.comebackDate).format('YYYY-MM-DD');

                        $state.go('results', options, {inherit: false, reload: true});
                    }
                };
            }
        };
    }]);
