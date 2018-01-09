angular.module('vliegdutch').directive('filterAirlines', ['$filter', function ($filter) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            filters: '=',
            flights: '='
        },
        templateUrl: 'views/filter-airlines.html',
        link: function ($scope) {
            $scope.filters.airlines = $scope.filters.airlines || {};

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

            /**
             * @param {{carrier, carrierName}} segment
             * @param price
             * @returns {{airline: *, airlineName: *, price: number, checked: boolean}}
             */
            var getCarrier = function (segment, price) {
                return {
                    airline: segment.carrier,
                    airlineName: segment.carrierName,
                    price: Math.round(price),
                    checked: true
                };
            };

            var updateFiltersData = function () {
                $scope.filters.airlines = {};

                var unchecked = [];
                $scope.airlines.forEach(function (airline) {
                    if (!airline.checked) unchecked.push(airline.airline);
                });

                $scope.filters.airlines.unchecked = unchecked;
            };

            $scope.reset = function () {
                var airlines = [];

                /**
                 * @param flight.forwardSegments
                 * @param flight.comebackSegments
                 */
                $scope.flights.forEach(function (flight) {
                    flight.forwardSegments.forEach(function (segment) {
                        airlines.push(getCarrier(segment, flight.price));
                    });

                    flight.comebackSegments.forEach(function (segment) {
                        airlines.push(getCarrier(segment, flight.price));
                    });
                });
                $scope.airlines = $filter('unique')(airlines, 'airline');
                updateFiltersData();
            };

            $scope.toggleItem = function (item) {
                item.checked = !item.checked;
                updateFiltersData();
            };

            $scope.reset();

            $scope.collapsed = false;
            $scope.$watch('collapsed', function (collapsed) {
                if (collapsed) $scope.headerIcon = 'keyboard_arrow_down';
                else $scope.headerIcon = 'keyboard_arrow_up';
            });

            $scope.selectOnly = function (item) {
                $scope.airlines.forEach(function (item) {
                    item.checked = false;
                });

                item.checked = true;
                updateFiltersData();
            };
        }
    };
}]);
