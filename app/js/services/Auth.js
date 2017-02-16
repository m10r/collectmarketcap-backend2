angular.module('App').factory('Auth', ['$http', '$window', '$cookies', '$timeout', '$q', function($http, $window, $cookies, $timeout, $q) {
    var service = {};
    service.rememberMe = false;

    service.login = function(user, pass, remember) {
        var deferred = $q.defer();

        setTimeout(function() {
            if (user == "Rams") {
                deferred.resolve({data:{
                    user: user,
                    pass: pass,
                    result: 0,
                }});
            } else {
                deferred.resolve({data:{
                    result: 1
                }
                });
            }
        }, 100);

        return deferred.promise
            .then(function(response) {
                if (response.data.result === 0) {
                    response.data.logintimestamp = new Date().getTime() / 1000;
                    response.data.expTimeInSec = 1000000;
                    response.data.rememberMe = service.rememberMe;
                    return response.data;
                } else {
                    throw response.data;
                }
            })
            .then(function(info) {
                service.setUserInfo(info);
                return info;
            })
    };

    service.setUserInfo = function(info) {
        if ($window.localStorage) {
            $window.localStorage.setItem('userInfo', angular.toJson(info));
        }
        service.info = info;
    };

    service.getUserInfo = function() {
        if (!service.info && $window.localStorage) {
            service.info = angular.fromJson($window.localStorage.getItem('userInfo'));
        }
        return service.info;
    };

    service.isAuthenticated = function() {
        var info = this.getUserInfo();
        return info && ((info.logintimestamp + info.expTimeInSec) > new Date().getTime() / 1000);
    };


    service.restartSession = function() {
        var info = this.getUserInfo();
        info.logintimestamp = new Date().getTime() / 1000;
    };

    service.getSessionId = function() {
        var info = this.getUserInfo();
        return info && info.sessionId;
    };
    service.logout = function() {
        service.setUserInfo({});
    };
    return service;

}]);