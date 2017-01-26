angular.module('MetronicApp').factory('LeaderBoardService', ['$http', 'Auth', function ($http, Auth) {
    var service = {};

    service.GetLeaderSummary = function (lastDays) {
        return $http.get('http://svn.paymaxs.com/augmented3/dashboard.asmx/GetTimedLeadersSummary', {
            params: {
                sessionId: Auth.getSessionId(),
                pageSize: 50,
                lastDays: lastDays
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

    service.GetLeaderPageData = function (requestId, page) {
        return $http.get('http://svn.paymaxs.com/augmented3/dashboard.asmx/GetTimedLeadersPageData', {
            params: {
                sessionId: Auth.getSessionId(),
                requestId: requestId,
                pageNum: page
            }
        })
            .then(function (response) {
                if (response.data.Result === 0) {
                    return response.data.Leaders;
                } else {
                    throw  response.data;
                }
            });
    };

    service.GetPointsTotal = function () {
        return $http.get('http://svn.paymaxs.com/augmented3/dashboard.asmx/GetPointsTotal', {
            params: {
                sessionId: Auth.getSessionId()
            }
        })
            .then(function (response) {
                if (response.data.Result === 0) {
                    return response.data.PointsTotals;
                } else {
                    throw  response.data;
                }
            });
    };

    return service;
}]);