angular.module('vliegdutch').directive('filterAirlinesTab', ['$filter', function ($filter) {

    return {
        restrict: 'E',
        transclude: true,
        scope: {
            filtersData: '=',
            flights: '='
        },
        templateUrl: 'views/filter-airlines-tab.html',
        link: function (scope) {
            scope.filtersData.airlines = scope.filtersData.airlines || {};

            scope.multipleAirlines = true;

            var _getCarrier = function (segment) {
                return {
                    carrier: segment.carrier,
                    carrierName: segment.carrierName,
                    checked: true
                };
            };

            var _setCarriers = function () {
                var carriers = [];

                scope.flights.forEach(function (flight) {
                    flight.forwardSegments.forEach(function (segment) {
                        carriers.push(_getCarrier(segment));
                    });

                    flight.comebackSegments.forEach(function (segment) {
                        carriers.push(_getCarrier(segment));
                    });
                });

                scope.carriers = $filter('unique')(carriers, 'carrier');
            };

            var _updateFiltersData = function () {
                scope.filtersData.airlines = {};

                if (scope.multipleAirlines)
                    scope.filtersData.airlines.multipleAirlines = scope.multipleAirlines;

                var unchecked = [];

                scope.carriers.forEach(function (carrier) {
                    if (!carrier.checked) unchecked.push(carrier.carrier);
                });

                scope.filtersData.airlines.unchecked = unchecked;
            };

            scope.toggleItem = function (item) {
                item.checked = !item.checked;
                _updateFiltersData();
            };

            scope.toggleMultipleAirlines = function () {
                scope.multipleAirlines = !scope.multipleAirlines;
                _updateFiltersData();
            };

            // Initialize
            _setCarriers();
            _updateFiltersData();
        }
    };
}]);
