var app = angular.module('vliegdutch', [
    'ngResource',
    'ui.router',
    'pasvaz.bindonce',
    'angular.filter',
    'rzModule',
    'pascalprecht.translate',
    'ngCookies'
]);

var endpoint = 'http://localhost:3000/api/v1';

app.constant('API_V1', endpoint);