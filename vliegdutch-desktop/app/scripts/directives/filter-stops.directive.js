angular.module('vliegdutch').directive('filterStops', [function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            filters: '=',
            flights: '='
        },
        templateUrl: 'views/filter-stops.html',
        link: function ($scope) {

            $scope.prices = {
                direct: [],
                oneStop: [],
                twoStops: []
            };

            function hasStops(flight, n) {
                if (flight.comebackSegments.length === 0) return flight.forwardSegments.length === (n + 1);
                else return (flight.forwardSegments.length === (n + 1) && flight.comebackSegments.length === (n + 1));
            }

            /**
             * @param {{priceRound}} flight
             */
            $scope.flights.forEach(function (flight) {
                if (hasStops(flight, 0)) $scope.prices.direct.push(flight.priceRound);
                if (hasStops(flight, 1)) $scope.prices.oneStop.push(flight.priceRound);
                if (hasStops(flight, 2)) $scope.prices.twoStops.push(flight.priceRound);
            });

            $scope.filters.stops = $scope.filters.stops || {};

            $scope.reset = function () {
                angular.merge($scope.filters.stops, {
                    direct: true,
                    oneStop: true,
                    twoStops: true
                });
            };

            $scope.reset();

            $scope.collapsed = false;
            $scope.$watch('collapsed', function (collapsed) {
                if (collapsed) $scope.headerIcon = 'keyboard_arrow_down';
                else $scope.headerIcon = 'keyboard_arrow_up';
            });

            $scope.selectOnly = function (type) {
                $scope.filters.stops = {
                    direct: false,
                    oneStop: false,
                    twoStops: false
                };
                $scope.filters.stops[type] = true;
            };
        }
    };
}]);
