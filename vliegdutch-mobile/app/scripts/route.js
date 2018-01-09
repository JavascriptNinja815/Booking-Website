angular.module('vliegdutch').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'views/index.html',
            controller: 'SearchController'
        })
        .state('results', {
            url: '/results?departureCity&departureAirport&arrivalCity&arrivalAirport&departureDate&comebackDate&adults&children&babies',
            templateUrl: 'views/results.html',
            controller: 'ResultsController'
        });
}]);