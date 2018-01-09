angular.module('vliegdutch').directive('pricesMatrix', ['$state', '$stateParams', function ($state, $stateParams) {

    return {
        restrict: 'E',
        transclude: true,
        scope: {
            show: '=',
            mode: '=',
            searchOptions: '=',
            prices: '=',
            close: '&onClose'
        },
        templateUrl: 'views/prices-matrix.html',
        link: function ($scope) {
            $scope.matrix = [];

            var formatDate = function (m) {
                return m.format('YYYY-MM-DD');
            };

            var updateMatrix = function () {
                var departure = moment.range($scope.departureDateMin, $scope.departureDateMax);
                var matrix = [];
                if ($scope.searchOptions.comebackDate) {
                    var comeback = moment.range($scope.comebackDateMin, $scope.comebackDateMax);

                    departure.by('days', function (d) {
                        var row = [];
                        comeback.by('days', function (c) {
                            var result = $scope.results.filter(function (result) {
                                return formatDate(d) === result.departureDate && formatDate(c) === result.comebackDate;
                            })[0];

                            var cheapestPrice = Math.min.apply(null, $scope.prices
                                .filter(function (result) {
                                    return formatDate(d) === result.departure_date && formatDate(c) === result.comeback_date
                                })
                                .map(function (val) {
                                    return val.price.amount_display
                                }));

                            cheapestPrice = isFinite(cheapestPrice) ? cheapestPrice : undefined;
                            row.push({d: d, c: c, result: result, price: cheapestPrice});
                        });
                        matrix.push(row);
                    });

                    $scope.matrix = matrix;
                } else {
                    departure.by('days', function (d) {
                        var result = $scope.results.filter(function (result) {
                            return formatDate(d) === result.departureDate;
                        })[0];

                        var cheapestPrice = Math.min.apply(null, $scope.prices
                            .filter(function (result) {
                                return formatDate(d) === result.departure_date
                            })
                            .map(function (val) {
                                return val.price.amount_display
                            }));

                        cheapestPrice = isFinite(cheapestPrice) ? cheapestPrice : undefined;

                        matrix.push({d: d, result: result, price: cheapestPrice});
                    });
                    $scope.matrix = matrix;
                }
            };

            var reset = function () {
                $scope.departureDateMin = moment($scope.searchOptions.departureDate).subtract(2, 'day');
                $scope.departureDateMax = moment($scope.searchOptions.departureDate).add(3, 'days');

                var params = {
                    roundTrip: $scope.mode === 'roundtrip', adults: $scope.searchOptions.adults,
                    children: $scope.searchOptions.children,
                    babies: $scope.searchOptions.babies,
                    departureDate: formatDate($scope.departureDateMin) + '|' + formatDate($scope.departureDateMax)
                };

                if ($scope.searchOptions.departureCity) params.departureCity = $scope.searchOptions.departureCity;
                else if ($stateParams.departureAirport) params.departureAirport = $scope.searchOptions.departureAirport;

                if ($scope.searchOptions.arrivalCity) params.arrivalCity = $scope.searchOptions.arrivalCity;
                else if ($stateParams.arrivalAirport) params.arrivalAirport = $scope.searchOptions.arrivalAirport;

                if ($scope.searchOptions.comebackDate) {
                    $scope.comebackDateMin = moment($scope.searchOptions.comebackDate).subtract(2, 'day');
                    $scope.comebackDateMax = moment($scope.searchOptions.comebackDate).add(3, 'days');
                    params.comebackDate = formatDate($scope.comebackDateMin) + '|' + formatDate($scope.comebackDateMax);
                }

                $scope.results = [];
                updateMatrix();
            };

            $scope.matrixDate = function (m) {
                return m.format('ddd, DD, MMM');
            };

            reset();

            $scope.search = function (cell) {
                $state.go('results',
                    {
                        departureCity: $scope.searchOptions.departureCity,
                        departureAirport: $scope.searchOptions.departureAirport,
                        arrivalCity: $scope.searchOptions.arrivalCity,
                        arrivalAirport: $scope.searchOptions.arrivalAirport,
                        departureDate: formatDate(cell.d),
                        comebackDate: cell.c ? formatDate(cell.c) : null
                    });
            };
        }
    };
}]);
