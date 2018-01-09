angular.module('vliegdutch').directive('filterAirportsTab', ['$filter', function ($filter) {

    return {
        restrict: 'E',
        transclude: true,
        scope: {
            filtersData: '=',
            flights: '='
        },
        templateUrl: 'views/filter-airports-tab.html',
        link: function (scope) {
            scope.filtersData.airports = scope.filtersData.airports || {};

            var _setAirports = function () {
                var airports = [];

                /**
                 * @param {{arrivalAirport, arrivalAirportName, arrivalCity,
                 *  departureAirport, departureAirportName, departureCity}} sector
                 * @private
                 */
                var _pushSectorAirports = function (sector) {
                    airports.push({
                        iata: sector.arrivalAirport,
                        name: sector.arrivalAirportName,
                        city: sector.arrivalCity,
                        checked: true
                    });
                    airports.push({
                        iata: sector.departureAirport,
                        name: sector.departureAirportName,
                        city: sector.departureCity,
                        checked: true
                    });
                };

                scope.flights.forEach(function (flight) {
                    _pushSectorAirports(flight.forwardSector);
                    if (flight.comebackSector.length > 0) _pushSectorAirports(flight.comebackSector);
                });

                scope.airports = $filter('unique')(airports, 'iata');
            };

            var _updateFiltersData = function () {
                scope.filtersData.airports = {};

                var unchecked = [];
                scope.airports.forEach(function (airport) {
                    if (!airport.checked) unchecked.push(airport.iata);
                });

                scope.filtersData.airports.unchecked = unchecked;
            };

            scope.toggleItem = function (item) {
                item.checked = !item.checked;
                _updateFiltersData();
            };

            // Initialize
            _setAirports();
            _updateFiltersData();
        }
    };
}]);
