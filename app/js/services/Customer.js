    angular.module('App').factory('Customer', ['$http', 'Auth', '$q', function ($http, Auth, $q) {
    var service = {};
    var mockdata = [{ id: 1, firstname: "Jon1", lastname:"Doe"},
                    { id: 2, firstname: "Roy2", lastname:"Doe"},
                    { id: 3, firstname: "Green3", lastname:"Doe"},
                    { id: 4, firstname: "Hamos4", lastname:"Doe"},
                    { id: 5, firstname: "Harry5", lastname:"Doe"},
                    { id: 6, firstname: "Harry6", lastname:"Doe"},
                    { id: 7, firstname: "Jon7", lastname:"Doe"},
                    { id: 8, firstname: "Green8", lastname:"Doe"},
                    { id: 9, firstname: "Roy9", lastname:"Doe"},
                    { id: 10, firstname: "Green11", lastname:"Doe"},
                    { id: 11, firstname: "Hamos12", lastname:"Doe"},
                    { id: 12, firstname: "Harry13", lastname:"Doe"},
                    { id: 13, firstname: "Harry14", lastname:"Doe"},
                    { id: 14, firstname: "Jon15", lastname:"Doe"},
                    { id: 15, firstname: "Green16", lastname:"Doe"},
                    { id: 16, firstname: "Roy17", lastname:"Doe"},
                    { id: 17, firstname: "Green18", lastname:"Doe"},
                    { id: 18, firstname: "Hamos19", lastname:"Doe"},
                    { id: 19, firstname: "Harry20", lastname:"Doe"},
                    { id: 20, firstname: "Harry21", lastname:"Doe"},
                    { id: 21, firstname: "Jon22", lastname:"Doe"},
                    { id: 22, firstname: "Green23", lastname:"Doe"},];
    var topid = 23;
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
                    if(customer.id == mockdata[i].id){
                        mockdata[i] = customer;
                        deferred.resolve(customer);
                    }
                }
            }, 100);
        else
            setTimeout(function() {
                customer.id = topid;
                topid ++;
                mockdata.push(customer);
                deferred.resolve(customer);
            }, 100);
        return deferred.promise;
    };
    service.getNew = function () {
        var deferred = $q.defer();

        setTimeout(function() {
            deferred.resolve({firstname:"", lastname:""});
        }, 100);
        return deferred.promise;
    };

    service.delete = function (id) {
        var deferred = $q.defer();

        setTimeout(function() {
            for (var i = 0; i < mockdata.length; i++) {
                if(id == mockdata[i].id){
                    mockdata.splice(i, 1);
                    deferred.resolve(true);
                }
            }
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