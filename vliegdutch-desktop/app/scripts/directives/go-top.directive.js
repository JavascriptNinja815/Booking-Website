angular.module('vliegdutch').directive('goTop', [function () {

    return {
        restrict: 'E',
        replace: true,
        scope: {
            top: '@'
        },
        template: '<button type="button" id="GoToTop" class="btn">' +
        '<i class="fa fa-angle-up" aria-hidden="true"></i>' +
        '</button>',
        link: function (scope, element) {
            //go back to the top button functionality
            if ($(element).length) {
                var backToTop = function () {
                    var windowScrollTop = $(window).scrollTop(),
                        wh = $(window).innerHeight(),
                        scrollTop = windowScrollTop + wh;
                    if (scrollTop > parseInt(scope.top)) $(element).addClass('show');
                    else $(element).removeClass('show');
                };


                $(window).on('scroll', function () {
                    backToTop();
                });
                $(element).on('click', function (e) {
                    e.preventDefault();
                    $('html,body').animate({
                        scrollTop: 0
                    }, 700);
                });
            }
        }
    };
}]);
