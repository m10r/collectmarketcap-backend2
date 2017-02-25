/***
 Metronic AngularJS App Main Script
 ***/

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
}]);

App.controller('HeaderController', ['$scope', function ($scope) {
}]);

/* Login Controller */
App.controller('LoginController', ['$rootScope', '$scope', 'Auth', '$window', function ($rootScope, $scope, Auth, $window) {

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
        .state('dashboard', {
            url: "/dashboard.html",
            templateUrl: "views/dashboard.html",
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

        .state('customer', {
            url: "/customer.html",
            templateUrl: "views/customer/customer.html",
            controller: "CustomerController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'App',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
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
                            'js/services/Customer.js',
                            'js/controllers/CustomerEditController.js'
                        ]
                    }); 
                }]
            }
        })


        // Advanced Datatables
        .state('appointment', {
            url: "/appointment.html",
            templateUrl: "views/appointment/appointment.html",
            data: {pageTitle: 'Appointment'},
            controller: "AppointmentController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'App',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'js/services/Customer.js',
                            'js/services/Appointment.js',
                            'js/controllers/AppointmentController.js'
                        ]
                    });
                }]
            }
        })
         .state('appointment-edit', {
            url: "/appointment/{method}/{id}",
            templateUrl: "views/appointment/appointment-edit.html",
            data: {pageTitle: 'Edit Appointment'},
            controller: "AppointmentEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'App',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'js/services/Customer.js',
                            'js/services/Appointment.js',
                            'js/controllers/AppointmentEditController.js'
                        ]
                    }]);
                }]
            }
        });
       
}]);