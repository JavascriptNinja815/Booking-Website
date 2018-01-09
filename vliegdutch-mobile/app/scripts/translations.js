angular.module('vliegdutch').config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('en', {
        MENU: {
            HEADER: 'MENU',
            SEARCH_FLIGHTS: 'SEARCH',
            E_TICKET: 'E-TICKET',
            MONDAY: 'Mon',
            FRIDAY: 'Fri',
            MANAGE_BOOKING: {
                HEADER: 'MANAGE BOOKING',
                TEXT: 'Fill out the data here and you will be able to see status of your order and make neccessary changes.',
                CONFIRM: 'Confirmation number ?',
                FORGOT: 'Forgot the number?',
                SUBMIT: 'SUBMIT',
                BACK: 'BACK',
                FORGOT_MODAL: {
                    TEXT_HEADER: 'Your booking number was previously sent to your :',
                    TEXT_BODY_1: 'Email inbox',
                    TEXT_BODY_2: 'SMS inbox',
                    TEXT_FOOTER: 'If you can’t find it, please contact us at ',
                    BACK: 'BACK'
                }
            }
        },
        SEARCH: {
            HEADER: 'Cheap flights. Get yours!',
            ROUND_TRIP: 'Round trip',
            ONE_WAY: 'One way',
            FROM: 'From',
            TO: 'To',
            DEPART: 'Depart',
            RETURN: 'Return',
            ADULT: 'Adult',
            ADULTS: 'Adults',
            CHILD: 'Child',
            CHILDREN: 'Children',
            BABY: 'Baby',
            BABIES: 'Babies',
            FROM_TO_MODAL: {
                HEADER: 'SELECT DESTINATION',
                FROM: 'FROM',
                TO: 'TO',
                DEPARTURE_PLACEHOLDER: 'Enter departure location',
                ARRIVAL_PLACEHOLDER: 'Enter arrival location',
                POPULAR_DESTINATIONS: 'POPULAR DESTINATIONS'
            },
            DEPART_RETURN_MODAL: {
                HEADER: 'SELECT DATES',
                DEPARTURE: 'DEPARTURE',
                RETURN: 'RETURN'
            },
            PASSENGERS_MODAL: {
                HEADER: 'PASSENGERS',
                YR: 'yr.',
                ADULTS: 'ADULTS',
                CHILDREN: 'CHILDREN',
                BABIES: 'BABIES',
                DONE: 'DONE'
            },
            SEARCH: 'SEARCH'
        },
        LOADING: {
            HEADER: 'We are searching for the best price',
            PLEASE_WAIT: 'Please wait...',
            FREE: 'Free',
            TRAVEL_CANCELLATION: 'Travel Cancellation',
            ONLINE_CHECK_IN: 'Online check-in',
            TRANSACTION_FEE: 'Transaction fee'
        },
        RESULTS: {
            HEADER: 'RESULTS',
            FEE: 'excl. €15 transaction fee',
            SHOW_MORE: 'Show more',
            SORT: {
                HEADER: 'SORT',
                CHEAPEST: 'Cheapest',
                QUICKEST: 'Quickest',
                BEST: 'Best'
            },
            FILTER: {
                HEADER: 'FILTER',
                FILTER_MODAL: {
                    HEADER: 'FILTER RESULTS',
                    STOPS: {
                        DIRECT_FLIGHT: 'Direct flight',
                        ONE_STOP: '1 stop',
                        TWO_STOPS: '2 stops'
                    },
                    TIME: {
                        FLIGHT_DURATION: 'FLIGHT DURATION',
                        TAKE_OFF: 'TAKE-OFF',
                        LANDING: 'LANDING'
                    },
                    QUALITY: {
                        OVERNIGHT_FLIGHT: 'Overnight flight',
                        OVERNIGHT_LAYOVER: 'Overnight layover',
                        SHORT_STOPOVER: 'Stopover less than 40m'
                    },
                    SAVE_FILTER: 'SAVE FILTER'
                }
            }
        }
    });

    $translateProvider.translations('nl', {
        MENU: {
            HEADER: 'MENU',
            SEARCH_FLIGHTS: 'ZOEKEN',
            E_TICKET: 'E-TICKET',
            MONDAY: 'Ma',
            FRIDAY: 'Vri',
            MANAGE_BOOKING: {
                HEADER: 'BEHEER JOUW BOEKING',
                TEXT: 'Vul de gegevens hier in en u kunt de status van uw bestelling zien en wijzigingen aanbrengen.',
                CONFIRM: 'Boekingsnummer ?',
                FORGOT: 'Wachtwoord vergeten?',
                SUBMIT: 'SUBMIT',
                BACK: 'TERUG',
                FORGOT_MODAL: {
                    TEXT_HEADER: 'Uw bookingsnunmer is eerder verzenden naar uw :',
                    TEXT_BODY_1: 'Email inbox',
                    TEXT_BODY_2: 'SMS inbox',
                    TEXT_FOOTER: 'Als u het niet kunt vinden, neem dan contact met ons op ',
                    BACK: 'TERUG'
                }
            }
        },
        SEARCH: {
            HEADER: 'Cheap flights. Get yours!',
            ROUND_TRIP: 'Retour',
            ONE_WAY: 'Enkele reis',
            FROM: 'Van',
            TO: 'Nar',
            DEPART: 'Vertrek',
            RETURN: 'Terug',
            ADULT: 'Volwassene',
            ADULTS: 'Volwassenen',
            CHILD: 'Kind',
            CHILDREN: 'Kinderen',
            BABY: 'Baby',
            BABIES: 'Babies',
            FROM_TO_MODAL: {
                HEADER: 'SELECT DESTINATION',
                FROM: 'VAN',
                TO: 'NAR',
                DEPARTURE_PLACEHOLDER: 'Vul de vertrekplaats in',
                ARRIVAL_PLACEHOLDER: 'Vul de aankomstlocatie in',
                POPULAR_DESTINATIONS: 'POPULAIRE BESTEMMINGEN'
            },
            DEPART_RETURN_MODAL: {
                HEADER: 'KIES DATUM',
                DEPARTURE: 'VERTREK',
                RETURN: 'TERUG'
            },
            PASSENGERS_MODAL: {
                HEADER: 'PASSENGERS',
                YR: 'jr.',
                ADULTS: 'VOLWASSENEN',
                CHILDREN: 'KINDEREN',
                BABIES: 'BABIES',
                DONE: 'SLUITEN'
            },
            SEARCH: 'ZOEKEN'
        },
        LOADING: {
            HEADER: 'We zijn op zoek naar de beste prijs',
            PLEASE_WAIT: 'Even geduld a.u.b',
            FREE: 'Gratis',
            TRAVEL_CANCELLATION: 'Annuleringsverzekering',
            ONLINE_CHECK_IN: 'Online inchecken',
            TRANSACTION_FEE: 'Boekingkosten'
        },
        RESULTS: {
            HEADER: 'RESULTATEN',
            FEE: 'excl. €15 boekingkosten',
            SHOW_MORE: 'Toon alles',
            SORT: {
                HEADER: 'SOORT',
                CHEAPEST: 'Goedkoopste',
                QUICKEST: 'Snelste',
                BEST: 'Best'
            },
            FILTER: {
                HEADER: 'FILTER',
                FILTER_MODAL: {
                    HEADER: 'FILTER RESULTATEN',
                    STOPS: {
                        DIRECT_FLIGHT: 'Directe vluchten',
                        ONE_STOP: '1 tussenstop',
                        TWO_STOPS: '2 tussenstops'
                    },
                    TIME: {
                        FLIGHT_DURATION: 'VLUCHTDUUR',
                        TAKE_OFF: 'VERTREK',
                        LANDING: 'AANKOMST'
                    },
                    QUALITY: {
                        OVERNIGHT_FLIGHT: 'Nachtvlucht',
                        OVERNIGHT_LAYOVER: 'Overnight layover',
                        SHORT_STOPOVER: 'Tussenstop minder dan 40m'
                    },
                    SAVE_FILTER: 'BEWAAR FILTER'
                }
            }
        }
    });

    var clientLocale = $translateProvider.resolveClientLocale();

    ['en', 'nl'].indexOf(clientLocale) !== -1
        ? $translateProvider.preferredLanguage(clientLocale)
        : $translateProvider.preferredLanguage('en');

    $translateProvider.fallbackLanguage('en');
    $translateProvider.useCookieStorage();
    $translateProvider.useSanitizeValueStrategy(null);
}]);