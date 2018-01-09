angular.module('vliegdutch').directive('flightRow', [function () {

    return {
        restrict: 'E',
        scope: {
            segments: '=',
            sector: '='
        },
        templateUrl: 'views/flight-row.html'
    };
}]);
