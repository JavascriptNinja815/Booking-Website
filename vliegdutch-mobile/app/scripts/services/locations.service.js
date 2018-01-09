angular.module('vliegdutch').factory('Location', ['$resource', 'API_V1', function ($resource, API_V1) {

    return $resource(API_V1, {}, {
        search: {
            method: 'GET',
            url: API_V1 + '/locations/search',
            isArray: true,
            cancellable: true
        },
        commonDeparture: {
            method: 'GET',
            url: API_V1 + '/locations/common-departures',
            isArray: true
        },
        getAirport: {
            method: 'GET',
            url: API_V1 + '/locations/airport'
        }
    });
}]);
