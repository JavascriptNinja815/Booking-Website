angular.module('vliegdutch').directive('filterStopsTab', [function () {

    return {
        restrict: 'E',
        transclude: true,
        scope: {
            filtersData: '='
        },
        templateUrl: 'views/filter-stops-tab.html',
        link: function (scope) {
            scope.reset = function () {
                scope.filtersData.stops = scope.filtersData.stops || {};

                angular.merge(scope.filtersData.stops, {
                    direct: true,
                    oneStop: true,
                    twoStops: true
                });
            };

            scope.reset();

            scope.toggleFilter = function (id) {
                scope.filtersData.stops[id] = !scope.filtersData.stops[id];
            };
        }
    };
}]);
