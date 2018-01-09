angular.module('vliegdutch').directive('filterDuration', ['$rootScope', '$timeout', function ($rootScope, $timeout) {

    return {
        restrict: 'E',
        transclude: true,
        scope: {
            filters: '=',
            flights: '='
        },
        templateUrl: 'views/filter-duration.html',
        link: function ($scope) {
            $scope.filters.duration = $scope.filters.duration || [];

            var updateSliders = function () {
                $timeout(function () {
                    $rootScope.$broadcast('rzFilterForceRender');
                    $rootScope.$broadcast('reCalcViewDimensions');
                }, 50);
            };

            $scope.reset = function () {
                var min = Number.MAX_SAFE_INTEGER;
                var max = 0;

                $scope.flights.forEach(function (flight) {
                    if (flight.forwardSector.durationMinutes < min) min = flight.forwardSector.durationMinutes;
                    if (flight.forwardSector.durationMinutes > max) max = flight.forwardSector.durationMinutes;
                    if (flight.comebackSector.durationMinutes < min) min = flight.comebackSector.durationMinutes;
                    if (flight.comebackSector.durationMinutes > max) max = flight.comebackSector.durationMinutes;
                });

                $scope.filters.duration = [min, max];
                $scope.sliderOptions = {
                    floor: min,
                    ceil: max,
                    step: 10,
                    minRange: 60,
                    pushRange: true
                };

                updateSliders();
            };

            var timeInHours = function (m) {
                var hours = Math.floor(m.asHours()),
                    minutes = Math.floor(m.asMinutes()) - hours * 60;

                return hours + 'h ' + (minutes === 0 ? '00' : minutes) + 'm';
            };

            $scope.formattedTime = function (time) {
                return timeInHours(moment.duration(time, 'minutes'));
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
