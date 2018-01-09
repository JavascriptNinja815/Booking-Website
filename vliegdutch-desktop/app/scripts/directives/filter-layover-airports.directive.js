angular.module('vliegdutch').directive('filterLayoverAirports', ['$filter', function ($filter) {

    return {
        restrict: 'E',
        transclude: true,
        scope: {
            filters: '=',
            flights: '='
        },
        templateUrl: 'views/filter-layover-airports.html',
        link: function ($scope) {
            $scope.filters.layoverAirports = $scope.filters.layoverAirports || [];

            var DEFAULT_OPTIONS_COUNT = 5;

            $scope.shownAll = false;
            $scope.optionsCount = DEFAULT_OPTIONS_COUNT;

            $scope.showMore = function () {
                $scope.optionsCount = Number.MAX_SAFE_INTEGER;
                $scope.shownAll = true;
            };

            $scope.showLess = function () {
                $scope.optionsCount = DEFAULT_OPTIONS_COUNT;
                $scope.shownAll = false;
            };

            var updateFiltersData = function () {
                $scope.filters.layoverAirports = {};

                var unchecked = [];
                $scope.airports.forEach(function (airport) {
                    if (!airport.checked) unchecked.push(airport.iata);
                });

                $scope.filters.layoverAirports.unchecked = unchecked;
            };

            $scope.reset = function () {
                var airports = [];

                var pushSegmentAirport = function (sector) {
                    airports.push({
                        iata: sector.arrivalAirport,
                        name: sector.arrivalAirportName,
                        city: sector.arrivalCity,
                        checked: true
                    });
                };

                $scope.flights.forEach(function (flight) {
                    flight.forwardSegments
                        .slice(0, flight.forwardSegments.length - 1)
                        .forEach(pushSegmentAirport);

                    flight.comebackSegments
                        .slice(0, flight.comebackSegments.length - 1)
                        .forEach(pushSegmentAirport);
                });

                $scope.airports = $filter('unique')(airports, 'iata');
                updateFiltersData();
            };

            $scope.toggleItem = function (item) {
                item.checked = !item.checked;
                updateFiltersData();
            };

            $scope.selectOnly = function (item) {
                $scope.airports.forEach(function (item) {
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
