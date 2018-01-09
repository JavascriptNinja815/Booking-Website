angular.module('vliegdutch').directive('footerElement', ['$translate', function ($translate) {

    return {
        restrict: 'E',
        templateUrl: 'views/footer-element.html',
        link: function ($scope) {
            $scope.language = $translate.use();

            $scope.changeLanguage = function (key) {
                $scope.language = key;
                $translate.use(key);
            };
        }
    };
}]);
