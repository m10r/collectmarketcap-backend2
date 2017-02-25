angular.module('App').factory('Appointment', ['$http', 'Auth', '$q', function ($http, Auth, $q) {
    var service = {};
    var mockdata = [{ id: 1, customer: "Jon1", datetime:"2017-02-01"},
                    { id: 2, customer: "Roy2", datetime:"2017-02-01"},
                    { id: 3, customer: "Green3", datetime:"2017-02-01"},
                    { id: 4, customer: "Hamos4", datetime:"2017-02-01"},
                    { id: 5, customer: "Harry5", datetime:"2017-02-01"},
                    { id: 6, customer: "Harry6", datetime:"2017-02-01"},
                    { id: 7, customer: "Jon7", datetime:"2017-02-01"},
                    { id: 8, customer: "Green8", datetime:"2017-02-01"},
                    { id: 9, customer: "Roy9", datetime:"2017-02-01"},
                    { id: 10, customer: "Green11", datetime:"2017-02-01"},
                    { id: 11, customer: "Hamos12", datetime:"2017-02-01"},
                    { id: 12, customer: "Harry13", datetime:"2017-02-01"},
                    { id: 13, customer: "Harry14", datetime:"2017-02-01"},
                    { id: 14, customer: "Jon15", datetime:"2017-02-01"},
                    { id: 15, customer: "Green16", datetime:"2017-02-01"},
                    { id: 16, customer: "Roy17", datetime:"2017-02-01"},
                    { id: 17, customer: "Green18", datetime:"2017-02-01"},
                    { id: 18, customer: "Hamos19", datetime:"2017-02-01"},
                    { id: 19, customer: "Harry20", datetime:"2017-02-01"},
                    { id: 20, customer: "Harry21", datetime:"2017-02-01"},
                    { id: 21, customer: "Jon22", datetime:"2017-02-01"},
                    { id: 22, customer: "Green23", datetime:"2017-02-01"},];
    var topid = 23;
    service.appointments;
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

    service.save = function (appointment) {
        var deferred = $q.defer();
        if(appointment.id)
            setTimeout(function() {
                for (var i = 0; i < mockdata.length; i++) {
                    if(appointment.id == mockdata[i].id){
                        mockdata[i] = appointment;
                        deferred.resolve(appointment);
                    }
                }
            }, 100);
        else
            setTimeout(function() {
                appointment.id = topid;
                topid ++;
                mockdata.push(appointment);
                deferred.resolve(appointment);
            }, 100);
        return deferred.promise;
    };
    service.getNew = function () {
        var deferred = $q.defer();

        setTimeout(function() {
            deferred.resolve({customer:"", datetime:""});
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
            deferred.resolve({customer:"", datetime:""});
        }, 100);
        return deferred.promise;
    };
    service.GetAppointmentList = function () {

        var deferred = $q.defer();

        if(service.appointments == undefined)
            setTimeout(function() {
                deferred.resolve(mockdata);
            }, 100);
        else
            deferred.resolve(service.appointments);
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