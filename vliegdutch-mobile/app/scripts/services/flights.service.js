angular.module('vliegdutch').factory('Flight', ['$resource', 'API_V1', function ($resource, API_V1) {

    return $resource(API_V1, {}, {
        search: {
            method: 'GET',
            url: API_V1 + '/flights/search',
            isArray: true
        },
        cheapest: {
            method: 'GET',
            url: API_V1 + '/flights/cheapest',
            isArray: true
        }
    });
}]);
