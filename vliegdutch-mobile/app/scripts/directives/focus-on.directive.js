angular.module('vliegdutch').directive('focusOn', function () {

    return function (scope, elem, attr) {
        scope.$on(attr.focusOn, function () {
            elem[0].focus();
        });
    };
});