angular.module('vliegdutch').directive('filterTimeTab', ['$timeout', '$rootScope', function ($timeout, $rootScope) {

    return {
        restrict: 'E',
        transclude: true,
        scope: {
            filtersData: '=',
            flights: '='
        },
        templateUrl: 'views/filter-time-tab.html',
        link: function (scope) {
            scope.filtersData.times = scope.filtersData.times || {};

            var _updateFiltersData = function () {
                scope.filtersData.times = {};

                if (scope.durationFilter) {
                    scope.filtersData.times.duration = [
                        scope.durationFilter.min,
                        scope.durationFilter.max
                    ];
                }

                if (scope.takeOffForwardFilter) {
                    scope.filtersData.times.takeOffForward = [
                        scope.takeOffForwardFilter.min,
                        scope.takeOffForwardFilter.max
                    ];
                }

                if (scope.landingForwardFilter) {
                    scope.filtersData.times.landingForward = [
                        scope.landingForwardFilter.min,
                        scope.landingForwardFilter.max
                    ];
                }

                if (scope.takeOffComebackFilter) {
                    scope.filtersData.times.takeOffComeback = [
                        scope.takeOffComebackFilter.min,
                        scope.takeOffComebackFilter.max
                    ];
                }

                if (scope.landingComebackFilter) {
                    scope.filtersData.times.landingComeback = [
                        scope.landingComebackFilter.min,
                        scope.landingComebackFilter.max
                    ];
                }
            };

            var _setDurations = function () {
                var min = Number.MAX_SAFE_INTEGER;
                var max = 0;

                scope.flights.forEach(function (flight) {
                    if (flight.forwardSector.durationMinutes < min)
                        min = flight.forwardSector.durationMinutes;

                    if (flight.forwardSector.durationMinutes > max)
                        max = flight.forwardSector.durationMinutes;

                    if (flight.comebackSector.durationMinutes < min)
                        min = flight.comebackSector.durationMinutes;

                    if (flight.comebackSector.durationMinutes > max)
                        max = flight.comebackSector.durationMinutes;
                });

                scope.durationFilter = {
                    min: min,
                    max: max,
                    options: {
                        floor: min,
                        ceil: max,
                        step: 10,
                        minRange: 60,
                        pushRange: true,
                        onEnd: _updateFiltersData
                    }
                };
            };

            var _initTimeFilter = function (type) {
                scope[type + 'Filter'] = {
                    min: 0,
                    max: 1440,
                    options: {
                        floor: 0,
                        ceil: 1440,
                        step: 30,
                        minRange: 60,
                        pushRange: true,
                        onEnd: _updateFiltersData
                    }
                };
            };

            scope.takeOffCityForward = scope.flights[0].forwardSector.departureCity;
            _initTimeFilter('takeOffForward');

            scope.landingCityForward = scope.flights[0].forwardSector.arrivalCity;
            _initTimeFilter('landingForward');

            if (scope.flights[0].comebackSector.arrivalCity) {
                scope.takeOffCityComeback = scope.flights[0].comebackSector.departureCity;
                _initTimeFilter('takeOffComeback');

                scope.landingCityComeback = scope.flights[0].comebackSector.arrivalCity;
                _initTimeFilter('landingComeback');
            }

            var _timeInHours = function (m) {
                var hours = Math.floor(m.asHours()),
                    minutes = Math.floor(m.asMinutes()) - hours * 60;

                return hours + 'h ' + (minutes === 0 ? '00' : minutes) + 'm';
            };

            scope.formattedDuration = function (type) {
                return _timeInHours(moment.duration(scope.durationFilter[type], 'minutes'));
            };

            scope.formattedTimeFrom = function (type) {
                if (scope[type + 'Filter'])
                    return _timeInHours(moment.duration(scope[type + 'Filter'].min, 'minutes'));
            };

            scope.formattedTimeTo = function (type) {
                if (scope[type + 'Filter'])
                    return _timeInHours(moment.duration(scope[type + 'Filter'].max, 'minutes'));
            };

            scope.timeTab = 'take-off';
            scope.showTab = function (name) {
                scope.timeTab = name;
                $timeout(function () {
                    $rootScope.$broadcast('rzFilterForceRender');
                    $rootScope.$broadcast('reCalcViewDimensions');
                }, 50);
            };

            // Initialize
            _setDurations();
            _updateFiltersData();
        }
    };
}]);
