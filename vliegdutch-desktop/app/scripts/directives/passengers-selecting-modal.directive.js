angular.module('vliegdutch').directive('passengersSelectingModal', ['$state', function ($state) {
    return {
        restrict: 'E',
        scope: {
            show: '=',
            flight: '='
        },
        templateUrl: 'views/passengers-selecting-modal.html',
        link: function (scope) {
            scope.currentFlight = null;
            scope.count = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            scope.showPrice = true;

            scope.passenger = {
                adult: scope.count[1],
                children: scope.count[0],
                baby: scope.count[0]
            };

            scope.initialPassengers = angular.copy(scope.passenger);

            scope.$watchCollection('passenger', function (val) {
                scope.showPrice = angular.equals(val, scope.initialPassengers);
            });

            scope.$watch('flight', function (val) {
                scope.currentFlight = val;
            });

            scope.continue = function () {
                $state.go('results', {
                    departureCity: scope.currentFlight.departure_city.code,
                    arrivalCity: scope.currentFlight.arrival_city.code,
                    departureDate: scope.currentFlight.departure_date,
                    comebackDate: scope.currentFlight.comeback_date,
                    adults: scope.passenger.adult,
                    children: scope.passenger.children,
                    babies: scope.passenger.baby
                });
            }
        }
    };
}]);
