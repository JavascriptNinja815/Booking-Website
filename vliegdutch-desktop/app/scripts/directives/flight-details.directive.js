angular.module('vliegdutch').directive('flightDetails', [function () {

    return {
        restrict: 'E',
        transclude: true,
        scope: {
            sector: '=',
            segments: '='
        },
        templateUrl: 'views/flight-details.html',
        link: function ($scope) {
            $scope.dayAndDate = function (date) {
                return moment(date).format('ddd[,] DD MMM');
            };

            /**
             *
             * @param segment1.arrivalTime
             * @param segment2.departureTime
             * @returns {string}
             */
            $scope.layoverDuration = function (segment1, segment2) {
                var diff = moment(segment2.departureTime).diff(segment1.arrivalTime, 'minutes');
                var hours = Math.floor(diff / 60);
                var minutes = diff - hours * 60;

                if (hours) return hours + 'h ' + (minutes === 0 ? '00' : minutes) + 'm';
                else return (minutes === 0 ? '00' : minutes) + 'm';
            };
        }
    };
}]);
