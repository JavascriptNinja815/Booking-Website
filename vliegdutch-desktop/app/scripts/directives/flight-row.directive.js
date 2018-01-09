angular.module('vliegdutch').directive('flightRow', [function () {

    return {
        restrict: 'E',
        scope: {
            type: '@',
            segments: '=',
            sector: '='
        },
        templateUrl: 'views/flight-row.html',
        link: function ($scope) {
            $scope.departureDate = moment($scope.sector.departureTime.split(' ')[0]).format('DD-MM-YYYY');
        }
    };
}]);
