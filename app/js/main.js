/***
 Metronic AngularJS App Main Script
 ***/

/* Metronic App */
var App = angular.module("App", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    'ngCookies',
]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
App.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
App.config(['$controllerProvider', function ($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
 *********************************************/

/* Setup global settings */
App.factory('settings', ['$rootScope', function ($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: '../assets',
        globalPath: '../assets/global',
        layoutPath: '../assets/layouts/layout',
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
App.controller('AppController', ['$scope', '$rootScope', 'Auth', '$window', function ($scope, $rootScope, Auth, $window) {

    if(Auth.isAuthenticated())
        Auth.restartSession();
    
    $window.onbeforeunload = function (evt) {
        Auth.onclose();
    }
    $rootScope.isAuthenticated = function () {
        return Auth.isAuthenticated();
    };
    $rootScope.logout = function () {
         Auth.logout();
    };

    $scope.$on('$viewContentLoaded', function () {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
}]);

/***
 Layout Partials.
 By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
 initialization can be disabled and Layout.init() should be called on page load complete as explained above.
 ***/

/* Setup Layout Part - Header */
App.controller('HeaderController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initHeader(); // init header

        $(function () {
          $('[data-toggle="tooltip"]').tooltip()
        })
    });
}]);

/* Setup Layout Part - Sidebar */
App.controller('SidebarController', ['$state', '$scope', function ($state, $scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initSidebar($state); // init sidebar
    });

}]);

/* Setup Layout Part - Quick Sidebar */
App.controller('QuickSidebarController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        setTimeout(function () {   
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
App.controller('ThemePanelController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
    });
}]);

/* Setup Layout Part - Footer */
App.controller('FooterController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
    });
}]);

/* Login Controller */
App.controller('LoginController', ['$rootScope', '$scope', 'Auth', '$window', function ($rootScope, $scope, Auth, $window) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = false;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        $rootScope.settings.layout.login = true;
    });

    $scope.toggleForgetPassword = function () {
        $scope.forgetPassword = !$scope.forgetPassword;
    };

    $scope.removeAlert = function () {
        $scope.loginAlert = null;
    };

    $scope.doLogin = function (userData) {
        $scope.loggingIn = true;
        $scope.loginAlert = null;

        return Auth.login(userData.username, userData.password, userData.rememeberMe)
            .catch(function (err) {
                if (err.result === 2) {
                    $scope.loginAlert = "Wrong user or password"
                } else {
                    $scope.loginAlert = "Something went wrong. Try again later."
                }
            })
            .then(function () {
                $scope.loggingIn = false;
            })
    }

}]);

/* Setup Rounting For All Pages */
App.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("dashboard.html");

    $stateProvider
        // Dashboard
        .state('dashboard', {
            url: "/dashboard.html",
            templateUrl: "views/dashboard.html",
            data: {},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'App',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/DashboardController.js',
                        ]
                    });
                }]
            }
        })

        // Advanced Datatables
        .state('customer', {
            url: "/customer.html",
            templateUrl: "views/customer/customer.html",
            data: {pageTitle: 'Customer'},
            controller: "CustomerController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'App',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',

                            '../assets/pages/scripts/table-datatables-managed.min.js',

                            'js/services/Customer.js',
                            'js/controllers/CustomerController.js'
                        ]
                    });
                }]
            }
        })
        .state('customer-edit', {
            url: "/customer/{method}/{id}",
            templateUrl: "views/customer/customer-edit.html",
            data: {},
            controller: "CustomerEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'App',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            '../assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '../assets/global/plugins/typeahead/typeahead.css',

                            '../assets/global/plugins/fuelux/js/spinner.min.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            '../assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            '../assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                            '../assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                            '../assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            '../assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                            '../assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                            '../assets/global/plugins/typeahead/handlebars.min.js',
                            '../assets/global/plugins/typeahead/typeahead.bundle.min.js',
                            '../assets/pages/scripts/components-form-tools-2.min.js',

                            'js/services/Customer.js',
                            'js/controllers/CustomerEditController.js'
                        ]
                    }); 
                }]
            }
        })
        // Blank Page
        // .state('blank', {
        //     url: "/blank",
        //     templateUrl: "views/blank.html",
        //     data: {pageTitle: 'Blank Page Template'},
        //     controller: "BlankController",
        //     resolve: {
        //         deps: ['$ocLazyLoad', function ($ocLazyLoad) {
        //             return $ocLazyLoad.load({
        //                 name: 'App',
        //                 insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
        //                 files: [
        //                     'js/controllers/BlankController.js'
        //                 ]
        //             });
        //         }]
        //     }
        // })

        // AngularJS plugins
        .state('fileupload', {
            url: "/file_upload.html",
            templateUrl: "views/file_upload.html",
            data: {pageTitle: 'AngularJS File Upload'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'angularFileUpload',
                        files: [
                            '../assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
                        ]
                    }, {
                        name: 'App',
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // UI Select
        .state('uiselect', {
            url: "/ui_select.html",
            templateUrl: "views/ui_select.html",
            data: {pageTitle: 'AngularJS Ui Select'},
            controller: "UISelectController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'ui.select',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                            '../assets/global/plugins/angularjs/plugins/ui-select/select.min.js'
                        ]
                    }, {
                        name: 'App',
                        files: [
                            'js/controllers/UISelectController.js'
                        ]
                    }]);
                }]
            }
        })

        // UI Bootstrap
        .state('uibootstrap', {
            url: "/ui_bootstrap.html",
            templateUrl: "views/ui_bootstrap.html",
            data: {pageTitle: 'AngularJS UI Bootstrap'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'App',
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // Tree View
        .state('tree', {
            url: "/tree",
            templateUrl: "views/tree.html",
            data: {pageTitle: 'jQuery Tree View'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'App',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/jstree/dist/themes/default/style.min.css',

                            '../assets/global/plugins/jstree/dist/jstree.min.js',
                            '../assets/pages/scripts/ui-tree.min.js',
                            'js/controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // Form Tools
        .state('formtools', {
            url: "/form-tools",
            templateUrl: "views/form_tools.html",
            data: {pageTitle: 'Form Tools'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'App',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            '../assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '../assets/global/plugins/typeahead/typeahead.css',

                            '../assets/global/plugins/fuelux/js/spinner.min.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            '../assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            '../assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                            '../assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                            '../assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            '../assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                            '../assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                            '../assets/global/plugins/typeahead/handlebars.min.js',
                            '../assets/global/plugins/typeahead/typeahead.bundle.min.js',
                            '../assets/pages/scripts/components-form-tools-2.min.js',

                            'js/controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // Date & Time Pickers
        .state('pickers', {
            url: "/pickers",
            templateUrl: "views/pickers.html",
            data: {pageTitle: 'Date & Time Pickers'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'App',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/clockface/css/clockface.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                            '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            '../assets/global/plugins/clockface/js/clockface.js',
                            '../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                            '../assets/pages/scripts/components-date-time-pickers.min.js',

                            'js/controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // Custom Dropdowns
        .state('dropdowns', {
            url: "/dropdowns",
            templateUrl: "views/dropdowns.html",
            data: {pageTitle: 'Custom Dropdowns'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'App',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',

                            '../assets/pages/scripts/components-bootstrap-select.min.js',
                            '../assets/pages/scripts/components-select2.min.js',

                            'js/controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // Advanced Datatables
        .state('datatablesmanaged', {
            url: "/datatables/managed.html",
            templateUrl: "views/datatables/managed.html",
            data: {pageTitle: 'Advanced Datatables'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'App',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',

                            '../assets/pages/scripts/table-datatables-managed.min.js',

                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // Ajax Datetables
        .state('datatablesajax', {
            url: "/datatables/ajax.html",
            templateUrl: "views/datatables/ajax.html",
            data: {pageTitle: 'Ajax Datatables'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'App',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/scripts/datatable.js',

                            'js/scripts/table-ajax.js',
                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // User Profile
        .state("profile", {
            url: "/profile",
            templateUrl: "views/profile/main.html",
            data: {pageTitle: 'User Profile'},
            controller: "UserProfileController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'App',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../assets/pages/css/profile.css',

                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../assets/pages/scripts/profile.min.js',

                            'js/controllers/UserProfileController.js'
                        ]
                    });
                }]
            }
        })

        // User Profile Dashboard
        .state("profile.dashboard", {
            url: "/dashboard",
            templateUrl: "views/profile/dashboard.html",
            data: {pageTitle: 'User Profile'}
        })

        // User Profile Account
        .state("profile.account", {
            url: "/account",
            templateUrl: "views/profile/account.html",
            data: {pageTitle: 'User Account'}
        })

        // User Profile Help
        .state("profile.help", {
            url: "/help",
            templateUrl: "views/profile/help.html",
            data: {pageTitle: 'User Help'}
        })

        // Todo
        .state('todo', {
            url: "/todo",
            templateUrl: "views/todo.html",
            data: {pageTitle: 'Todo'},
            controller: "TodoController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'App',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/apps/css/todo-2.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/select2/js/select2.full.min.js',

                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',

                            '../assets/apps/scripts/todo-2.min.js',

                            'js/controllers/TodoController.js'
                        ]
                    });
                }]
            }
        })

        // FB Users
        .state('nylottery', {
            url: "/nylottery",
            templateUrl: "views/nylottery.html",
            data: {pageTitle: 'FB Users'},
            controller: "NyLotteryController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'App',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/apps/css/todo-2.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',,
                            'assets/css/nylottery.css',

                            '../assets/global/plugins/select2/js/select2.full.min.js',

                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',

                            '../assets/apps/scripts/todo-2.min.js',

                            'js/services/Auth.js',
                            'js/services/FBUserService.js',

                            'js/controllers/NyLotteryController.js'
                        ]
                    });
                }]
            }
        })
        .state('leaderboard', {
            url: "/leaderboard",
            templateUrl: "views/leaderboard.html",
            data: {pageTitle: 'Leaderboard'},
            controller: "LeaderBoardController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'App',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/apps/css/todo-2.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/select2/js/select2.full.min.js',

                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',

                            '../assets/apps/scripts/todo-2.min.js',

                            'js/services/Auth.js',
                            'js/services/FBUserService.js',
                            'js/services/LeaderBoardService.js',
                            'js/controllers/NyLotteryController.js',

                            'js/controllers/LeaderBoardController.js',
                            'assets/css/leaderboard.css',
                        ]
                    });
                }]
            }
        })
        .state('push_notification', {
            url: "/push_notification",
            templateUrl: "views/push_notification.html",
            data: {pageTitle: 'Push Notification'},
            controller: "PushNotificationController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'App',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/apps/css/todo-2.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/select2/js/select2.full.min.js',

                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',

                            '../assets/apps/scripts/todo-2.min.js',

                            'js/services/Auth.js',
                            'js/services/FBUserService.js',
                            // 'js/services/LeaderBoardService.js',
                            'js/controllers/PushNotificationController.js',

                            'assets/css/push_notification.css',
                        ]
                    });
                }]
            }
        })
        .state('analytics', {
            url: "/analytics",
            templateUrl: "views/analytics.html",
            data: {pageTitle: 'Analytics'},
            controller: "AnalyticsController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'App',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/amcharts/amchartsnew/style.css',

                            '../assets/global/plugins/morris/morris.css',
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            '../assets/pages/scripts/dashboard.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/apps/css/todo-2.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/select2/js/select2.full.min.js',

                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',

                            '../assets/apps/scripts/todo-2.min.js',

                            'js/services/Auth.js',
                            'js/services/FBUserService.js',
                            'js/services/GraphService.js',
                            // 'js/services/LeaderBoardService.js',
                            'js/controllers/AnalyticsController.js',

                            'assets/css/analytics.css',
                            '../assets/global/plugins/amcharts/amchartsnew/serial.js',
                            '../assets/global/plugins/amcharts/amchartsnew/amstock.js',
                        ]
                    });
                }]
            }
        })
}]);

/* Init global settings and run the app */
App.run(["$rootScope", "settings", "$state", function ($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
}]);