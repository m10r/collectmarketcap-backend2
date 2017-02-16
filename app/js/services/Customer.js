angular.module('App').factory('Customer', ['$http', 'Auth', '$q', function ($http, Auth, $q) {
    var service = {};
    var mockdata = [{ id: 1, firstname: "Jon", lastname:"Doe"},
                    { id: 2, firstname: "Roy", lastname:"Doe"},
                    { id: 3, firstname: "Green", lastname:"Doe"},
                    { id: 4, firstname: "Hamos", lastname:"Doe"},
                    { id: 5, firstname: "Harry", lastname:"Doe"},
                    { id: 6, firstname: "Harry", lastname:"Doe"},
                    { id: 7, firstname: "Jon", lastname:"Doe"},
                    { id: 8, firstname: "Green", lastname:"Doe"},
                    { id: 9, firstname: "Roy", lastname:"Doe"},
                    { id: 10, firstname: "Green", lastname:"Doe"},
                    { id: 11, firstname: "Hamos", lastname:"Doe"},
                    { id: 12, firstname: "Harry", lastname:"Doe"},
                    { id: 13, firstname: "Harry", lastname:"Doe"},
                    { id: 14, firstname: "Jon", lastname:"Doe"},
                    { id: 15, firstname: "Green", lastname:"Doe"},
                    { id: 16, firstname: "Roy", lastname:"Doe"},
                    { id: 17, firstname: "Green", lastname:"Doe"},
                    { id: 18, firstname: "Hamos", lastname:"Doe"},
                    { id: 19, firstname: "Harry", lastname:"Doe"},
                    { id: 20, firstname: "Harry", lastname:"Doe"},
                    { id: 21, firstname: "Jon", lastname:"Doe"},
                    { id: 22, firstname: "Green", lastname:"Doe"},]
    service.customers;
    service.get = function (id) {
        var deferred = $q.defer();

        setTimeout(function() {
            for (var i = 0; i < mockdata.length; i++) {
                if(id == mockdata[i].id)
                    deferred.resolve(mockdata[i]);
            }
        }, 100);
        return deferred.promise;
    };

    service.save = function (customer) {
        var deferred = $q.defer();
        if(customer.id)
            setTimeout(function() {
                for (var i = 0; i < mockdata.length; i++) {
                    if(id == mockdata[i].id){
                        mockdata[i] = customer;
                        deferred.resolve(customer);
                    }
                }
            }, 100);
        return deferred.promise;
    };
    service.getNew = function (id) {
        var deferred = $q.defer();

        setTimeout(function() {
            deferred.resolve({firstname:"", lastname:""});
        }, 100);
        return deferred.promise;
    };
    service.GetCustomerList = function () {

        var deferred = $q.defer();

        if(service.customers == undefined)
            setTimeout(function() {
                deferred.resolve(mockdata);
            }, 100);
        else
            deferred.resolve(service.customers);
        // return $http.get('http://svn.paymaxs.com/augmented3/dashboard.asmx/GetFBPagedSummary', {
        //     params: {
        //         sessionId: Auth.getSessionId(),
        //         pageSize: 50
        //     }
        // })
            return deferred.promise.then(function (response) {
                // if (response.data.Result === 0) {
                //     return response.data.PageInfo;
                // } else {
                //     throw  response.data;
                // }
                return response;
            })
    };

    return service;
}]);