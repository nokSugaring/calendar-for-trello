'use strict';

(function() {



    var module = angular.module('trelloCal', [

        // Dependencies

        'ngAnimate',
        'ngMaterial',
        'ui.sortable',
        'ui.router',
        'ngMdIcons',
        'LocalStorageModule',
        'ngSanitize',
        'ngProgress',
        'ui.select',

        // Route

        'trelloCal.month',
        'trelloCal.week',
        'trelloCal.stream',
        'trelloCal.boards',
        'trelloCal.settings',

        // Other


        'trelloCal.errorLogging',
        'trelloCal.analytics'


    ]);

    // get current URL with IE FIX
    if (!window.location.origin) {
        window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
    }

    module.constant('AppKey', '41485cd87d154168dd6db06cdd3ffd69');
    module.constant('baseUrl', window.location.origin);




    module.config(/*ngInject*/ function ( $urlRouterProvider, $stateProvider,localStorageServiceProvider, $mdThemingProvider) {


        $mdThemingProvider.theme('Indigo')
            .primaryPalette('blue')
            .accentPalette('green');


        localStorageServiceProvider
            .setPrefix('w11ktrello')
            .setStorageType('localStorage');

        $stateProvider


            .state('week', {
                url: '/week',
                views: {
                    'header': {
                        abstract: true,
                        templateUrl: 'partials/header.html',
                        controller: 'headerCtrl'

                    },
                    'sidebar':{
                        abstract: true,
                        templateUrl: 'partials/sidebar.html',
                        controller: 'headerCtrl'
                    },

                    'content': {
                        templateUrl: 'route/week/week.html',
                          controller: 'weekCtrl',
                        data: {
                            pageTitle: 'Week View'
                        }
                    },
                    'search':{
                         abstract: true,
                         templateUrl: 'partials/cardSearch.html',
                         controller: 'headerCtrl'
                    }
                }
                ,
                resolve: {
                    'asInitService':function (initService) {

                        return initService.init();
                    }
                }
            })

            .state('stream', {
                url: '/stream',
                views: {
                    'header': {
                        abstract: true,
                        templateUrl: 'partials/header.html',
                        controller: 'headerCtrl'

                    },
                    'sidebar':{
                        abstract: true,
                        templateUrl: 'partials/sidebar.html',
                        controller: 'headerCtrl'
                    },

                    'content': {
                        templateUrl: 'route/stream/stream.html',
                        controller: 'streamCtrl',
                        data: {
                            pageTitle: 'Week View'
                        }
                    },
                    'search':{
                        abstract: true,
                        templateUrl: 'partials/cardSearch.html',
                        controller: 'headerCtrl'
                    }
                }
                ,
                resolve: {
                    'init':function ( streamService) {
                        return streamService.get();
                    }

                }
            })

            .state('settings', {
                url: '/settings',
                views: {
                    'header': {
                        abstract: true,
                        templateUrl: 'partials/header.html',
                        controller: 'headerCtrl'

                    },
                    'sidebar':{
                        abstract: true,
                        templateUrl: 'partials/sidebar.html',
                        controller: 'headerCtrl'
                    },

                    'content': {
                        templateUrl: 'route/settings/settings.html',
                             controller: 'settingsCtrl',
                        data: {
                            pageTitle: 'Week View'
                        }
                    },
                    'search':{
                        abstract: true,
                        templateUrl: 'partials/cardSearch.html',
                        controller: 'headerCtrl'
                    }
                }
                ,
                resolve: {
                    'asInitService':function (initService) {

                        return initService.init();
                    }
                }
            })

            .state('about', {
                url: '/about',
                views: {
                    'header': {
                        abstract: true,
                        templateUrl: 'partials/header.html',
                        controller: 'headerCtrl'

                    },
                    'sidebar':{
                        abstract: true,
                        templateUrl: 'partials/sidebar.html',
                        controller: 'headerCtrl'
                    },

                    'content': {
                        templateUrl: 'route/about/about.html',
                        //     controller: 'settingsCtrl',
                        data: {
                            pageTitle: 'About'
                        }
                    },
                    'search':{
                        abstract: true,
                        templateUrl: 'partials/cardSearch.html',
                        controller: 'headerCtrl'
                    }
                }
            })

            .state('boards',{
                url: '/boards',
                views: {
                    'header': {
                        abstract: true,
                        templateUrl: 'partials/header.html',
                        controller: 'headerCtrl'
                    },
                    'sidebar':{
                        abstract: true,
                        templateUrl: 'partials/sidebar.html',
                         controller: 'headerCtrl'
                    },
                    'content': {
                        templateUrl: 'route/boards/boards.html',
                        controller: 'boardsCtrl',
                        data: {
                            pageTitle: 'Boards'
                        }
                    },
                    'search':{
                         abstract: true,
                         templateUrl: 'partials/cardSearch.html',
                         controller: 'headerCtrl'
                    }
                }
                ,
                 resolve: {
                      'asInitService':function (initService) {

                      return initService.init();
                      },
                      'getExistingBoardColors':function(localStorageService){
                        return localStorageService.get('Boards');
                      }

                 }
            })

            .state('token', {
                url: '/token?do&token',
                views: {
                    'menuContent': {
                        templateUrl: 'route/month/month.html'
                    }
                },
                resolve: {
                    'setToken': function (setToken,$stateParams,$location){
                        setToken.set($stateParams.token);

                        delete $location.$$search.token;
                        delete $location.$$search.do;
                        $location.path('/');
                    }
                }
            });

        if(localStorage.getItem('w11ktrello.startMonth') === 'false') {
            $urlRouterProvider.otherwise('/week');
        } else {
            $urlRouterProvider.otherwise('/month');
        }

        if(!localStorage.getItem('w11ktrello.boardColors')) {
            localStorage.setItem('w11ktrello.boardColors', false);
        }
        if(!localStorage.getItem('w11ktrello.observerMode')) {
            localStorage.setItem('w11ktrello.observerMode', false);
        }

    });


    module.run(/*ngInject*/ function ( $location, $rootScope) {
        if($location.$$protocol !== 'http') {
            $rootScope.mobil = true;
        }
    });

    module.controller('AppCtrl', function($scope, $rootScope, ngProgress, initService,$mdSidenav) {

        ngProgress.color('#C5CAE9');
        $rootScope.$on('$stateChangeSuccess', function () {
                ngProgress.complete();
            });
        $rootScope.$on('$stateChangeStart', function () {
            ngProgress.start();
        });


        $rootScope.$on('reload', function () {
            initService.refresh().then(function () {
                $rootScope.$broadcast('rebuild');
            });
        });
        $scope.keepOpen = false;


          function toggleRight(){
              $mdSidenav('right').toggle().then(function () {
                      $scope.keepOpen = !$scope.keepOpen;
                      if ($scope.keepOpen)
                          {angular.element('md-backdrop.md-sidenav-backdrop-custom').removeClass('disabled');}
                      else
                         {angular.element('md-backdrop.md-sidenav-backdrop-custom').addClass('disabled');}
                  });
            }

            $scope.toggleRight = toggleRight;

            $scope.checkClosingForm = function(){
                  if(true){
                       toggleRight();
                  }
              };

//          function drag(){
//                $scope.checkClosingForm();
//          }

    });

    module.controller('headerCtrl', function($scope,$mdSidenav,$state, initService, $window, localStorageService,$location,$mdBottomSheet, $rootScope) {

            $scope.cards=initService.getCards().withDue.concat(initService.getCards().withoutDue);

                $scope.actions = [
                    { name: 'Refresh', icon: 'sync', identifier: 'refresh' },
                    { name: 'Logout', icon: 'clear', identifier: 'logout' }
                ];

                $scope.more = [
                    {name: 'Submit Feature Request', icon: 'wb_incandescent', identifier: 'feature'},
                    {name: 'Report a Problem', icon: 'report_problem', identifier: 'bug'}
                ];

//                    $scope.sortableOptions = {
//                        receive: function (e, ui) {
//                            $scope.checkClosingForm();
//                            console.log('x');
//                            console.log(e,ui);
//                            var id = ui.item[0].firstElementChild.id.split('-')[0];
//                            ngProgress.start();
//                            var str = e.target.id+ui.item[0].firstElementChild.id.split('-')[1];
//
//                            var newStr = [];
//                            angular.forEach(str.split(','), function(value) {
//                                newStr.push(parseInt(value));
//                            });
//                            console.log(newStr);
//                            if(!newStr[3]){newStr[3]=12;newStr.push(0);newStr.push(0);}
//                            console.log(newStr);
//                            var targetDate = new Date(newStr[0],newStr[1]-1,newStr[2],newStr[3],newStr[4]);
//                            changeDate.async(id, targetDate).then(function () {
//                                    initService.updateDate(id, targetDate);
//                                    ngProgress.complete();
//                                },
//                                function () {
//                                    var dialog = function () {
//                                        $mdDialog.show(
//                                            $mdDialog.alert()
//                                                .parent(angular.element(document.body))
//                                                .title('Oops, something went wrong.')
//                                                .content('please check your connection and reload this page')
//                                                .ariaLabel('Connection Error')
//                                                .ok('reload')
//                                            //  .targetEvent(ev)
//                                        ).then(function () {
//                                                changeDate.async(ui.item[0].firstElementChild.id.split('-')[0], targetDate).then(function () {
//                                                    // user is only, successfull
//                                                }, function () {
//                                                    dialog();
//                                                });
//                                            });
//                                    };
//                                    dialog();
//                                });
//                        },
//                        placeholder: 'card',
//                        connectWith: '.dayCards'
//                    };

                $scope.listItemClick = function(identifier) {
                    var url = 'https://github.com/w11k/trello-calendar';

                    switch(identifier) {
                                        case 'logout':
                                            $scope.logout();
                                            break;
                                        case 'refresh':
                                            $rootScope.$broadcast('reload');
                                            break;
                                        case 'feature':
                                            window.open(url,'_blank');
                                            break;
                                        case 'bug':
                                            window.open(url,'_blank');
                                            break;
                                    }
                    $mdBottomSheet.hide(identifier);
                };

        if(initService.print()) {
            $scope.name = initService.print()[0].data.fullName;
            } else {
            $scope.name = 'please login';
        }


        $scope.toggleSidenav = function (menuId) {
            $mdSidenav(menuId).toggle();
        };

        $scope.closeSidenav = function (menuId) {
            $mdSidenav(menuId).close();
        };
        $scope.openSidenav = function (menuId) {
            $mdSidenav(menuId).open();
        };

        $scope.goTo = function(target) {
            $location.path('/'+target);
            $scope.toggleSidenav('left');


        };

        $scope.logout = function () {
            initService.remove();
            $scope.login = false;
            $window.location.reload();
        };

        $scope.toHome = function () {
              if(localStorageService.get('startMonth') !== false) {
                  $location.path('/month');
            } else {
                  $location.path('/week');
            }
        };


    var url = 'https://github.com/w11k/trello-calendar';
        $scope.showListBottomSheet = function() {
            $mdBottomSheet.show({
                templateUrl: 'partials/bottomSheet.html',
                controller: 'ListBottomSheetCtrl'
            }).then(function(clickedItem) {
                switch(clickedItem) {
                    case 'logout':
                        $scope.logout();
                        break;
                    case 'refresh':
                        $rootScope.$broadcast('reload');
                        break;
                    case 'feature':
                        window.open(url,'_blank');
                        break;
                    case 'bug':
                        window.open(url,'_blank');
                        break;
                }
            });
        };

    });

    module.controller('ListBottomSheetCtrl', function($scope, $mdBottomSheet) {

        $scope.actions = [
            { name: 'Refresh', icon: 'sync', identifier: 'refresh' },
            { name: 'Logout', icon: 'clear', identifier: 'logout' }
        ];

        $scope.more = [
            {name: 'Submit Feature Request', icon: 'wb_incandescent', identifier: 'feature'},
            {name: 'Report a Problem', icon: 'report_problem', identifier: 'bug'}
        ];

        $scope.listItemClick = function(identifier) {
            $mdBottomSheet.hide(identifier);
        };
    });


    module.directive('updateTitle', ['$rootScope', '$timeout',
        function($rootScope, $timeout) {
            return {
                link: function(scope, element) {

                    var listener = function(event, toState) {

                        var title = 'Default Title';
                        if (toState.data && toState.data.pageTitle) {
                            title = toState.data.pageTitle;
                        }

                        $timeout(function() {
                            element.text(title);
                        }, 0, false);
                    };

                    $rootScope.$on('$stateChangeSuccess', listener);
                }
            };
        }
    ]);

    module.filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) {
                return '';
            }

            max = parseInt(max, 10);
            if (!max) {
                return value;
            }
            if (value.length <= max){
                return value;
            }

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace !== -1) {
                    value = value.substr(0, lastspace);
                }
            }
            return value + (tail || ' …');
        };
    });

})();




