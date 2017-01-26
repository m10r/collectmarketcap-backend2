angular.module('MetronicApp').factory('FBUserService', ['$http', 'Auth', function ($http, Auth) {
    var service = {};

    service.GetFBPagedSummary = function () {
        return $http.get('http://svn.paymaxs.com/augmented3/dashboard.asmx/GetFBPagedSummary', {
            params: {
                sessionId: Auth.getSessionId(),
                pageSize: 50
            }
        })
            .then(function (response) {
                if (response.data.Result === 0) {
                    return response.data.PageInfo;
                } else {
                    throw  response.data;
                }
            })
    };

    service.GetFBPageData = function (requestId, page) {
        return $http.get('http://svn.paymaxs.com/augmented3/dashboard.asmx/GetFBPageData', {
            params: {
                sessionId: Auth.getSessionId(),
                requestId: requestId,
                pageNum: page
            }
        })
            .then(function (response) {
                if (response.data.Result === 0) {
                    return response.data.FBData;
                } else {
                    throw  response.data;
                }
            });
    };
    service.GetFBTotals = function () {
        return $http.get('http://svn.paymaxs.com/augmented3/dashboard.asmx/GetFBTotals', {
            params: {
                sessionId: Auth.getSessionId()
            }
        })
            .then(function (response) {
                if (response.data.Result === 0) {
                    return response.data.FBTotals;
                } else {
                    throw  response.data;
                }
            });
    };

    service.GetUsersTotal = function () {
        return $http.get('http://svn.paymaxs.com/augmented3/dashboard.asmx/GetUsersTotal', {
            params: {
                sessionId: Auth.getSessionId()
            }
        })
            .then(function (response) {
                if (response.data.Result === 0) {
                    return response.data.UsersTotals;
                } else {
                    throw  response.data;
                }
            });
    };
    return service;
}]);