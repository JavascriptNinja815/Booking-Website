angular.module('vliegdutch').directive('filterQualityTab', [function () {

    return {
        restrict: 'E',
        transclude: true,
        scope: {
            filtersData: '='
        },
        templateUrl: 'views/filter-quality-tab.html',
        link: function (scope) {
            scope.reset = function () {
                scope.filtersData.quality = scope.filtersData.quality || {};

                angular.merge(scope.filtersData.quality, {
                    overnightFlight: true,
                    overnightLayover: true,
                    shortStopover: true
                });
            };

            scope.reset();

            scope.toggleFilter = function (id) {
                scope.filtersData.quality[id] = !scope.filtersData.quality[id];
            };
        }
    };
}]);
