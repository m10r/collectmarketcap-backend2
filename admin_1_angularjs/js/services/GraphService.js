angular.module('MetronicApp').factory('GraphService', ['$http', 'Auth', function ($http, Auth) {
    var service = {};

    service.GetUsersByTime = function (resolution = "Monthly") {
        return $http.get('http://svn.paymaxs.com/augmented3/dashboard.asmx/GetUsersByTime', {
            params: {
                sessionId: Auth.getSessionId(),
                resolution: resolution
            }
        })
        .then(function (response) {
            if (response.data.Result === 0) {
                return response.data.TimelyData;
            } else {
                throw  response.data;
            }
        })
    };

    service.GetSessionsByTime = function (resolution = "Monthly") {
        return $http.get('http://svn.paymaxs.com/augmented3/dashboard.asmx/GetSessionsByTime', {
            params: {
                sessionId: Auth.getSessionId(),
                resolution: resolution
            }
        })
        .then(function (response) {
            if (response.data.Result === 0) {
                return response.data.TimelyData;
            } else {
                throw  response.data;
            }
        })
    };
    return service;
}]);