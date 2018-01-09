angular.module('vliegdutch').directive('filterAirports', ['$filter', function ($filter) {

    return {
        restrict: 'E',
        transclude: true,
        scope: {
            filters: '=',
            flights: '='
        },
        templateUrl: 'views/filter-airports.html',
        link: function ($scope) {
            $scope.filters.airports = $scope.filters.airports || {};

            var updateFiltersData = function () {
                $scope.filters.airports = {};

                var unchecked = [];
                $scope.airports.forEach(function (airport) {
                    if (!airport.checked) unchecked.push(airport.iata);
                });

                $scope.filters.airports.unchecked = unchecked;
            };

            $scope.reset = function () {
                var airports = [];

                /**
                 * @param {{arrivalAirportName, arrivalAirport, arrivalCity,
                 *   departureAirport, departureAirportName, departureCity}} sector
                 */
                var pushSectorAirports = function (sector) {
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

                $scope.flights.forEach(function (flight) {
                    pushSectorAirports(flight.forwardSector);
                    if (flight.comebackSector.length > 0) pushSectorAirports(flight.comebackSector);
                });

                $scope.airports = $filter('unique')(airports, 'iata');
                updateFiltersData();
            };

            $scope.toggleItem = function (item) {
                item.checked = !item.checked;
                updateFiltersData();
            };

            $scope.selectOnly = function (item) {
                var sameCityAirports = $scope.airports.filter(function (airport) {
                    return airport.city === item.city;
                });

                sameCityAirports.forEach(function (item) {
                    item.checked = false;
                });

                item.checked = true;
                updateFiltersData();
            };

            // Initializer
            $scope.reset();

            $scope.collapsed = false;
            $scope.$watch('collapsed', function (collapsed) {
                if (collapsed) $scope.headerIcon = 'keyboard_arrow_down';
                else $scope.headerIcon = 'keyboard_arrow_up';
            });
        }
    };
}]);
