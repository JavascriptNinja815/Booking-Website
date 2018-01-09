angular.module('vliegdutch').directive('filterTimes', ['$timeout', '$rootScope', function ($timeout, $rootScope) {

    return {
        restrict: 'E',
        transclude: true,
        scope: {
            filters: '=',
            flights: '='
        },
        templateUrl: 'views/filter-times.html',
        link: function ($scope) {
            $scope.filters.times = $scope.filters.times || {};

            var updateSliders = function () {
                $timeout(function () {
                    $rootScope.$broadcast('rzFilterForceRender');
                    $rootScope.$broadcast('reCalcViewDimensions');
                }, 50);
            };

            var updateFiltersData = function () {
                $scope.filters.times = {};

                if ($scope.takeOffForwardFilter) {
                    $scope.filters.times.takeOffForward = [
                        $scope.takeOffForwardFilter.min,
                        $scope.takeOffForwardFilter.max
                    ];
                }

                if ($scope.landingForwardFilter) {
                    $scope.filters.times.landingForward = [
                        $scope.landingForwardFilter.min,
                        $scope.landingForwardFilter.max
                    ];
                }

                if ($scope.takeOffComebackFilter) {
                    $scope.filters.times.takeOffComeback = [
                        $scope.takeOffComebackFilter.min,
                        $scope.takeOffComebackFilter.max
                    ];
                }

                if ($scope.landingComebackFilter) {
                    $scope.filters.times.landingComeback = [
                        $scope.landingComebackFilter.min,
                        $scope.landingComebackFilter.max
                    ];
                }
            };

            var initTimeFilter = function (type) {
                $scope[type + 'Filter'] = {
                    min: 0,
                    max: 1440,
                    options: {
                        floor: 0,
                        ceil: 1440,
                        step: 30,
                        minRange: 60,
                        pushRange: true,
                        onEnd: updateFiltersData
                    }
                };
            };

            $scope.reset = function () {
                $scope.takeOffCityForward = $scope.flights[0].forwardSector.departureCity;
                initTimeFilter('takeOffForward');

                $scope.landingCityForward = $scope.flights[0].forwardSector.arrivalCity;
                initTimeFilter('landingForward');

                updateSliders();
                updateFiltersData();
            };

            if ($scope.flights[0].comebackSector.arrivalCity) {
                $scope.takeOffCityComeback = $scope.flights[0].comebackSector.departureCity;
                initTimeFilter('takeOffComeback');

                $scope.landingCityComeback = $scope.flights[0].comebackSector.arrivalCity;
                initTimeFilter('landingComeback');
            }

            var timeInHours = function (m) {
                var hours = Math.floor(m.asHours()),
                    minutes = Math.floor(m.asMinutes()) - hours * 60;

                return hours + 'h ' + (minutes === 0 ? '00' : minutes) + 'm';
            };

            $scope.formattedDuration = function (type) {
                return timeInHours(moment.duration($scope.durationFilter[type], 'minutes'));
            };

            $scope.formattedTimeFrom = function (type) {
                if ($scope[type + 'Filter'])
                    return timeInHours(moment.duration($scope[type + 'Filter'].min, 'minutes'));
            };

            $scope.formattedTimeTo = function (type) {
                if ($scope[type + 'Filter'])
                    return timeInHours(moment.duration($scope[type + 'Filter'].max, 'minutes'));
            };

            $scope.timeTab = 'take-off';
            $scope.showTab = function (name) {
                $scope.timeTab = name;
                updateSliders();
            };

            // Initializer
            $scope.reset();
        }
    };
}]);

