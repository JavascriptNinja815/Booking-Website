angular.module('vliegdutch').factory('Flight', ['$resource', 'API_V1', function ($resource, API_V1) {

    return $resource(API_V1, {}, {
        search: {
            method: 'GET',
            url: API_V1 + '/flights/search',
            isArray: true
        },
        pricesCalendar: {
            method: 'GET',
            url: API_V1 + '/flights/prices-calendar',
            isArray: true
        },
        alert: {
            method: 'POST',
            url: API_V1 + '/flights/alert',
            transformResponse: function (data) { // used to get string instead of array of char
                return {message: angular.fromJson(data)}
            }
        }
    });
}]);