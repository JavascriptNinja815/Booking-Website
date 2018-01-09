angular.module('vliegdutch').directive('manageBookingModal', [function () {

    return {
        restrict: 'E',
        scope: {
            show: '='
        },
        templateUrl: 'views/manage-booking-modal.html',
        link: function ($scope) {
            $scope.showForgotNumber = false;

            $scope.switchToForgotNumber = function () {
                $scope.show = false;
                $scope.showForgotNumber = true;
            };

            $scope.switchToMainModal = function () {
                $scope.showForgotNumber = false;
                $scope.show = true;
            };

            $('#order-management-modal').on('click', function () {
                $scope.show = false;
                $scope.$apply();
            });

            $('#forgot-booking-number-modal').on('click', function () {
                $scope.showForgotNumber = false;
                $scope.$apply();
            });
        }
    };
}]);
