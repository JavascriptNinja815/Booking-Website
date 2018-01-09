angular.module('vliegdutch').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'views/index.html',
            controller: 'IndexController'
        })
        .state('results', {
            url: '/results?departureCity&departureAirport&arrivalCity&arrivalAirport&departureDate&comebackDate&adults&children&babies',
            templateUrl: 'views/results.html',
            controller: 'ResultsController'
        })
        .state('price_calendar', {
            url: '/price_calendar?type&departureCity&arrivalCity&roundTrip&duration&departureDate&comebackDate',
            templateUrl: 'views/price-calendar.html',
            controller: 'PriceCalendarController'
        })
        .state('privacy-policy', {
            url: '/privacy-policy',
            templateUrl: 'views/privacy-policy.html',
            controller: 'PrivacyPolicyController'
        })
        // .state('booking', {
        //     url: '/booking',
        //     templateUrl: 'views/booking.html',
        //     controller: 'BookingController'
        //     // controllerAs: 'framed'
        // })

}]);