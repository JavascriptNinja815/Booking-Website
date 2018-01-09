angular.module('vliegdutch')
    .controller('SearchController', ['$filter', '$translate', '$scope', '$state', '$timeout', 'Flight', 'Location',
        function ($filter, $translate, $scope, $state, $timeout, Flight, Location) {

            $scope.language = $translate.use();
            $scope.changeLanguage = function (key) {
                $scope.language = key;
                $translate.use(key);
            };

            $scope.mode = 'roundtrip';
            $scope.departureLocation = null;
            $scope.arrivalLocation = null;
            $scope.departureDate = null;
            $scope.comebackDate = null;
            $scope.adults = 1;
            $scope.children = 0;
            $scope.infants = 0;

            $scope.calendarPrices = [];
            $scope.calendar = [];

            var $modal1 = $('#nav-modal');
            var $modal2 = $('#order-management-modal');
            var $modal3 = $('#forgot-booking-number-modal');

            $scope.closeModals = function () {
                $scope.forgotBookingModal = false;
                $scope.showManagementModal = false;
                $scope.showNavigationModal = false;
                $modal1.css({'transform': 'translateX(0%)'})
            };

            $scope.openModals = function () {
                $modal2.css('transform', 'translateX(100%)');
                $modal3.css('transform', 'translateX(100%)');

                $scope.forgotBookingModal = true;
                $scope.showManagementModal = true;
                $scope.showNavigationModal = true
            };

            function transform(value) {
                return {'transform': 'translateX(' + value + '%)', 'transition': 'transform 0.4s'}
            }

            function applyAnimations(modal1, modal2, modal3) {
                $modal1.css(transform(modal1));
                $modal2.css(transform(modal2));
                $modal3.css(transform(modal3));
            }

            $scope.toModal = function (modal) {

                switch (modal) {
                    case 1:
                        applyAnimations(0, 100, 100);
                        break;
                    case 2:
                        applyAnimations(-100, 0, 100);
                        break;
                    case 3:
                        applyAnimations(-100, -100, 0);
                }
            };

            Location.commonDeparture(function (data) {
                $scope.commonDepartureDestinations = data;
            });

            $scope.loadingPopularDestinations = false;
            var _updatePopularDestinations = function () {
                if (!$scope.departureLocation) return;

                $scope.loadingPopularDestinations = true;

                Flight.cheapest({
                    roundTrip: $scope.mode === 'roundtrip',
                    departureCity: $scope.departureLocation.cityCode
                }, function (data) {
                    $scope.loadingPopularDestinations = false;
                    $scope.popularDestinations = data;
                });
            };

            var _updateCalendarPrices = function () {
                if (!$scope.departureLocation || !$scope.arrivalLocation) return;

                Flight.cheapest({
                    roundTrip: $scope.mode === 'roundtrip',
                    departureCity: $scope.departureLocation.cityCode,
                    arrivalLocation: $scope.arrivalLocation.cityCode
                }, function (data) {
                    var pricesCalendar = [];
                    for (var i in data) {
                        var record = data[i];
                        pricesCalendar.push({
                            comebackDate: moment(record.comebackDate),
                            departureDate: moment(record.departureDate),
                            price: record.price
                        });
                    }

                    $scope.calendarPrices = pricesCalendar;
                });
            };

            $scope.showPopularDestinations = function () {
                return $scope.locationTab === 'arrival' && (!$scope.locationQuery || $scope.locationQuery.length < 3);
            };

            $scope.showProposedDestinations = function () {
                return $scope.locationTab === 'departure' && (!$scope.locationQuery || $scope.locationQuery.length < 3);
            };

            $scope.$watch('departureLocation', function () {
                _updatePopularDestinations();
                _updateCalendarPrices();
            });

            $scope.$watch('arrivalLocation', function () {
                _updateCalendarPrices();
            });

            $scope.passengersSummary = function () {
                var result = '';
                result += $scope.adults + ' ' + ($scope.adults > 1
                        ? $filter('translate')('SEARCH.ADULTS')
                        : $filter('translate')('SEARCH.ADULT'));

                if ($scope.children > 0)
                    result += ', ' + $scope.children + ' ' + ($scope.children > 1
                            ? $filter('translate')('SEARCH.CHILDREN')
                            : $filter('translate')('SEARCH.CHILD'));
                if ($scope.infants > 0)
                    result += ', ' + $scope.infants + ' ' + ($scope.infants > 1
                            ? $filter('translate')('SEARCH.BABIES')
                            : $filter('translate')('SEARCH.BABY'));

                return result;
            };

            $scope.updatePassengers = function (type, n) {
                $scope[type] = n;
            };


            var _dayPrice = function (day) {
                if ($scope.calendarPrices && $scope.calendarPrices.length > 0) {
                    var dayPrices = [];

                    for (var i in $scope.calendarPrices) {
                        var calendarPrice = $scope.calendarPrices[i];

                        if ($scope.calendarTab === 'departure' && calendarPrice.departureDate.isSame(day, 'day')) {
                            dayPrices.push(calendarPrice.price);
                        }

                        if ($scope.calendarTab === 'comeback' && $scope.departureDate &&
                            calendarPrice.departureDate.isSame($scope.departureDate, 'day') &&
                            calendarPrice.comebackDate.isSame(day, 'day')) {
                            dayPrices.push(calendarPrice.price);
                        }
                    }

                    return dayPrices.sort()[0];
                }
            };

            var _updateCalendar = function () {
                var min;

                if ($scope.calendarTab === 'departure' || !$scope.departureDate) min = moment();
                else min = $scope.departureDate;

                var startDate = moment(min).startOf('month'),
                    endDate = moment(startDate).add(1, 'year').endOf('month'),
                    cm = [];

                $scope.calendar = [];

                moment().range(startDate, endDate).by('days', function (day) {
                    if (cm[cm.length - 1] && cm[cm.length - 1].day.month() !== day.month()) {
                        $scope.calendar.push(cm);
                        cm = [];
                    }

                    cm.push({
                        day: day,
                        price: _dayPrice(day)
                    });
                });
            };

            $scope.$watch('calendarPrices', function () {
                _updateCalendar();
            });

            $scope.showCalendar = function (type) {
                if (type === 'comeback' && $scope.mode === 'one-way') return;

                $scope.showCalendarModal = true;
                $scope.calendarTab = type;
                _updateCalendar();
                $timeout(function () {
                    $scope.$broadcast('focusToCalendar');
                }, 50);
            };

            $scope.calendarDayStyle = function (day) {
                if (day.date() === 1) return {marginLeft: (day.day() * 14) + '%'};
            };

            $scope.isSelectedDate = function (day) {
                return day.isSame($scope[$scope.calendarTab + 'Date']);
            };

            $scope.isDisabledDate = function (day) {
                return (day.isBefore(moment()) ||
                ($scope.calendarTab === 'comeback' && $scope.departureDate && day.isBefore($scope.departureDate)));
            };

            $scope.isReverseSelectedDate = function (day) {
                if ($scope.calendarTab === 'comeback' && $scope.departureDate) {
                    return $scope.departureDate.isSame(day);
                } else if ($scope.calendarTab === 'departure' && $scope.comebackDate) {
                    return $scope.comebackDate.isSame(day);
                }
            };

            $scope.isInRange = function (day) {
                if ($scope.departureDate && $scope.comebackDate) {
                    return day.isBetween($scope.departureDate, $scope.comebackDate);
                }
            };

            $scope.setDate = function (day) {
                if ($scope.isDisabledDate(day)) return false;

                if ($scope.calendarTab === 'departure') {
                    $scope.departureDate = day;
                    $scope.showCalendar('comeback');
                } else {
                    $scope.comebackDate = day;
                    $scope.showCalendarModal = false;
                }
            };

            var searchLocationsDelay = null;
            var _searchLocations = function (q) {
                if (q && q.length >= 3) {
                    $scope.locationsResults = [];
                    Location.search({code: q}).$promise.then(function (data) {
                        $scope.locationsResults = data;
                    });
                }
            };

            $scope.$watch('locationQuery', function (q) {
                if (searchLocationsDelay) $timeout.cancel(searchLocationsDelay);
                if (q && q.length >= 3) {
                    searchLocationsDelay = $timeout(function () {
                        _searchLocations(q);
                    }, 1500);
                }
            });

            $scope.locationSelectInputText = function () {
                if ($scope.locationTab === 'departure')
                    return $filter('translate')('SEARCH.FROM_TO_MODAL.DEPARTURE_PLACEHOLDER');
                else return $filter('translate')('SEARCH.FROM_TO_MODAL.ARRIVAL_PLACEHOLDER');
            };

            $scope.searchPlaceholderText = function (key) {
                if (key === 'FROM') return $filter('translate')('SEARCH.FROM');
                else if (key === 'TO') return $filter('translate')('SEARCH.TO');
                else if (key === 'DEPART') return $filter('translate')('SEARCH.DEPART');
                else if (key === 'RETURN') return $filter('translate')('SEARCH.RETURN');
                else return '';
            };

            $scope.showLocationSelect = function (type) {
                if (searchLocationsDelay) $timeout.cancel(searchLocationsDelay);
                $scope.locationsResults = null;
                $scope.locationTab = type;
                $scope.locationQuery = null;
                $scope.showLocationModal = true;
                $timeout(function () {
                    $scope.$broadcast('focusToLocationInput');
                }, 50);
            };

            $scope.setLocation = function (location) {
                if ($scope.locationTab === 'departure') {
                    $scope.departureLocation = location;
                    $scope.showLocationModal = false;
                    if (!$scope.arrivalLocation) {
                        $scope.showLocationSelect('arrival');
                    }
                } else {
                    $scope.arrivalLocation = location;
                    $scope.showLocationModal = false;
                }
            };

            /**
             * @param city
             * @param city.cityCode
             */
            $scope.setPopularArrival = function (city) {
                Location.getAirport({code: city.cityCode}, function (data) {
                    $scope.arrivalLocation = data;
                    $scope.showLocationModal = false;
                });
            };

            var _setSearchParamsLocation = function (options, type) {
                var location = $scope[type + 'Location'].id.split('-');
                if (location[0] === 'city') {
                    options[type + 'City'] = location[1];
                } else if (location[0] === 'airport') {
                    options[type + 'Airport'] = location[1];
                }

                return options;
            };

            $scope.doSearch = function () {
                if ($scope.departureLocation && $scope.arrivalLocation && $scope.departureDate &&
                    ($scope.mode === 'one-way' || ($scope.mode === 'roundtrip' && $scope.comebackDate))) {

                    var options = {
                        departureDate: $scope.departureDate.format('YYYY-MM-DD'),
                        adults: $scope.adults || 1,
                        children: $scope.children || 0,
                        babies: $scope.infants || 0
                    };

                    options = _setSearchParamsLocation(options, 'departure');
                    options = _setSearchParamsLocation(options, 'arrival');

                    if ($scope.mode === 'roundtrip') {
                        options.comebackDate = $scope.comebackDate.format('YYYY-MM-DD');
                    }

                    $state.go('results', options);
                }
            };
        }]);
