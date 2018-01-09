angular.module('vliegdutch').directive('headerElement', ['$translate', '$location', function ($translate, $location) {

    return {
        restrict: 'E',
        templateUrl: 'views/header-element.html',
        link: function ($scope) {
            $scope.language = $translate.use();

            $scope.langFlagsArr = [
                'images/language_flags/lang_flag_1.png',
                'images/language_flags/lang_flag_2.png'
            ];

            $scope.changeLanguage = function (key) {
                $scope.language = key;
                $translate.use(key);

                return key;
            };

            $scope.currentMenuElem = 0;

            function routeChangeDetector(data) {
                if (data.url === 'index') $scope.currentMenuElem = 0;
                if (data.url === 'price_calendar') $scope.currentMenuElem = 1;
                if (data.url === 'results') $scope.currentMenuElem = 2;
                if (data.url === 'privacy-policy') $scope.currentMenuElem = 2;
            }

            var location = $location.path();
            routeChangeDetector({url: location.substr(1, location.length)});

            $scope.$on('routeStateChange', function (e, data) {
                routeChangeDetector(data)
            });

            $scope.goToPriceCalendar = function () {
                $location.url('/price_calendar?roundTrip&duration&departureDate&comebackDate');
            };

            $scope.goToIndex = function () {
                $location.url('/');
            };
        }
    };
}]);
