angular.module('vliegdutch').directive('filters', ['$rootScope', '$timeout', function ($rootScope, $timeout) {

    return {
        restrict: 'E',
        replace: true,
        scope: {
            show: '=',
            flights: '=',
            onSave: '&'
        },
        templateUrl: 'views/filters.html',
        link: function (scope) {
            scope.filtersData = {};

            scope.$watch('show', function () {
                $timeout(function () {
                    $rootScope.$broadcast('rzSliderForceRender');
                }, 50);
            });
        }
    };
}]);
