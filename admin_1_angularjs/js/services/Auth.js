angular.module('MetronicApp').factory('Auth', ['$http', '$window','$cookies', function ($http, $window,$cookies) {
    var service = {};
    service.rememberMe = false;
    service.onclose = function(){

    }
    service.login = function (user, pass, remember) {
        return $http.get('http://svn.paymaxs.com/augmented3/dashboard.asmx/Login', {
            params: {
                username: user,
                password: pass
            }
        })
        .then(function (response) {
            if (response.data.result === 0) {
                response.data.logintimestamp = new Date().getTime() / 1000;
                response.data.expTimeInSec = 900;
                response.data.rememberMe = service.rememberMe;
                return response.data;
            } else {
                throw  response.data;
            }
        })
        .then(function (info) {
            service.setUserInfo(info);
            return info;
        })
    };
    service.setUserInfo = function (info) {
        if ($window.localStorage) {
            $window.localStorage.setItem('userInfo', angular.toJson(info));
        }
        service.info = info;
    };

    service.getUserInfo = function () {
        if (!service.info && $window.localStorage) {
            service.info = angular.fromJson($window.localStorage.getItem('userInfo'));
        }
        return service.info;
    };

    service.isAuthenticated = function () {
        var info = this.getUserInfo();
        return info && ((info.logintimestamp + info.expTimeInSec) > new Date().getTime() / 1000);
    };

    service.getSessionId = function () {
        var info = this.getUserInfo();
        return info && info.sessionId;
    };
    service.logout = function () {
        service.setUserInfo({});
    };
    return service;

}]);