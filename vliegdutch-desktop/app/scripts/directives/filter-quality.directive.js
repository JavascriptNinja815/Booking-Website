angular.module('vliegdutch').directive('filterQuality', [function () {

    return {
        restrict: 'E',
        transclude: true,
        scope: {
            filters: '='
        },
        templateUrl: 'views/filter-quality.html',
        link: function ($scope) {
            $scope.filters.quality = $scope.filters.quality || [];

            $scope.reset = function () {
                angular.merge($scope.filters.quality, {
                    overnightLayover: true,
                    shortStopover: true,
                    overnightFlight: true
                });
            };

            $scope.reset();

            $scope.collapsed = false;
            $scope.$watch('collapsed', function (collapsed) {
                if (collapsed) $scope.headerIcon = 'keyboard_arrow_down';
                else $scope.headerIcon = 'keyboard_arrow_up';
            });
        }
    };
}]);
