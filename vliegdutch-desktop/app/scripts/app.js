var app = angular.module('vliegdutch', [
    'ngResource',
    'ngCookies',
    'ui.router',
    'ui.date',
    'pasvaz.bindonce',
    'angular.filter',
    'pascalprecht.translate',
    'rzModule',
    'toastr'
]);

var endpoint = 'http://185.92.86.226:3000/api/v1';

app
    .constant('API_V1', endpoint)
    .run(['$rootScope', function ($rootScope) {
        $rootScope.$on('$stateChangeStart', function (e, to) {
            $rootScope.$broadcast('routeStateChange', {url: to.name})
        });
    }]);
