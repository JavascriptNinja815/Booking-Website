angular
    .module('vliegdutch')
    .controller('IndexController', ['$scope', '$state', '$filter', '$interval', 'Flight', 'Helpers',
        function ($scope, $state, $filter, $interval, Flight, Helpers) {

            $scope.offersFrom = 'AMS';
            $scope.offersType = 'one-way';
            $scope.showOffersMonths = false;
            $scope.offersMonths = [];

            moment.range(moment(), (moment().add(4, 'months'))).by('months', function (m) {
                $scope.offersMonths.push(m);
            });

            $scope.offersCities = [
                [{cityCode: 'AGP', city: 'Malaga'},
                    {cityCode: 'ALC', city: 'Alicante'},
                    {cityCode: 'BER', city: 'Berlin'},
                    {cityCode: 'BCN', city: 'Barcelona'},
                    {cityCode: 'DUB', city: 'Dublin'}],
                [{cityCode: 'FRA', city: 'Frankfurt'},
                    {cityCode: 'PAR', city: 'Paris'},
                    {cityCode: 'ROM', city: 'Rome'},
                    {cityCode: 'NYC', city: 'New York'},
                    {cityCode: 'LON', city: 'London'}],
                [{cityCode: 'IST', city: 'Istanbul'},
                    {cityCode: 'LIS', city: 'Lisbon'},
                    {cityCode: 'ATH', city: 'Athens'},
                    {cityCode: 'TCI', city: 'Tenerife'},
                    {cityCode: 'OSL', city: 'Oslo'}],
                [{cityCode: 'MAD', city: 'Madrid'},
                    {cityCode: 'LPA', city: 'Gran Canaria'},
                    {cityCode: 'MIL', city: 'Milan'},
                    {cityCode: 'VLC', city: 'Valencia'},
                    {cityCode: 'WAW', city: 'Warsaw'}]
            ];

            $scope.monthName = function (m) {
                return m.format('MMMM');
            };

            //JQuery code for some UI
            $(document).ready(function () {
                var passengerSelect = $('#passengers-select');
                var drop = $('.input-with-dropdown');
                var closeBtn = $('#passengerDropClose');

                //passenger count drop down open function
                passengerSelect.on('click', function () {
                    $(this).parent().toggleClass('open');
                });

                /**
                 * @description passenger count drop down close function after clicking on close button.
                 */
                closeBtn.on('click', function () {
                    if (drop.hasClass('open')) drop.removeClass('open');
                });

                /**
                 * @description passenger count drop down close function after clicking on body button.
                 */
                $('body').on('click', function (e) {
                    if (!drop.is(e.target)
                        && drop.has(e.target).length === 0
                        && $('.open').has(e.target).length === 0) {
                        drop.removeClass('open');
                    }
                });

                var one = $('#owlCarouselOne');
                var two = $('#owlCarouselTwo');


                //Special offers carousel
                two.owlCarousel({
                    loop: true,
                    items: 3,
                    scrollPerPage: true,
                    autoplay: true,
                    autoplayTimeout: 10000,
                    responsive: {
                        0: {
                            slideBy: 3
                        },
                        640: {
                            slideBy: 3
                        }
                    }
                });

                //Valued by our customers area carousel
                one.owlCarousel({
                    loop: true,
                    items: 4,
                    scrollPerPage: true,
                    autoplay: true,
                    autoplayTimeout: 6000,
                    responsive: {
                        0: {
                            slideBy: 4
                        },
                        640: {
                            slideBy: 4
                        }
                    }
                });

            });

            var searchForOffers = function () {
                $scope.cheapFlights = null;
                $scope.holidayFlights = null;
                $scope.longDistanceFlights = null;

                var options = {
                    roundTrip: $scope.offersType === 'round-trip'
                };
                var locationType = $scope.offersFrom === 'NRN' ? 'Airport' : 'City';

                options['departure' + locationType] = $scope.offersFrom;
                if ($scope.offersMonth) {
                    var start = $scope.offersMonth.startOf('month').format('YYYY-MM-DD');
                    var end = $scope.offersMonth.endOf('month').format('YYYY-MM-DD');
                    options.departureDate = start + '|' + end;
                }

                Flight.pricesCalendar(options, function (data) {
                    Helpers.sanitizeArrivalName(data);
                    $scope.cheapFlights = data;
                });

                Flight.pricesCalendar(angular.merge(options, {type: 'holiday'}), function (data) {
                    Helpers.sanitizeArrivalName(data);
                    $scope.holidayFlights = data;
                });

                Flight.pricesCalendar(angular.merge(options, {type: 'long_distance'}), function (data) {
                    Helpers.sanitizeArrivalName(data);
                    $scope.longDistanceFlights = data;
                });
            };

            $scope.suppliers = [
                {name: 'Ryanair', key: 'ryanair', departureCity: 'EIN'},
                {name: 'EasyJet', key: 'easyjet', departureCity: 'AMS'},
                {name: 'Lufthansa', key: 'lufthansa', departureCity: 'AMS'},
                {name: 'Norwegian', key: 'norwegianair', departureCity: 'AMS'},
                {name: 'WizzAir', key: 'wizzair', departureCity: 'EIN'},
                {name: 'Vueling', key: 'vueling', departureCity: 'AMS'},
                {name: 'Ryanair', key: 'ryanair', departureCity: 'DUS'},
                {name: 'EasyJet', key: 'easyjet', departureCity: 'AMS'},
                {name: 'AirBaltic', key: 'airbaltic', departureCity: 'AMS'}
            ];

            $scope.showSuppliers = 0;

            async.forEachOf($scope.suppliers, function (supplier) {
                Flight.pricesCalendar({
                    //roundTrip: 'true', // to set round trip
                    departureCity: supplier.departureCity,
                    supplier: supplier.key
                }, function (data) {
                    $scope.suppliers.find(function (obj) {
                        if (obj.key === supplier.key && obj.departureCity === supplier.departureCity) obj.data = data
                    });
                });
            });

            $scope.setOffersMonth = function (m) {
                $scope.offersMonth = m;
                searchForOffers()
            };

            $scope.setOffersFrom = function (val) {
                $scope.offersFrom = val;
                searchForOffers()
            };

            $scope.$watch('offersType', searchForOffers);

            /**
             * @type function
             * @param {object} flight
             * @param {object} flight.departure_city
             * @param {object} flight.arrival_city
             * @param flight.departure_date
             * @param flight.comeback_date
             */
            $scope.searchByFlight = function (flight) {
                $state.go('results', {
                    departureCity: flight.departure_city.code,
                    arrivalCity: flight.arrival_city.code,
                    departureDate: flight.departure_date,
                    comebackDate: flight.comeback_date
                });
            };
        }]);
