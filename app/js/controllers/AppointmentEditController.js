/* Setup general page controller */
angular.module('App').controller('AppointmentEditController',
 ['$rootScope', '$scope',  'Appointment', '$stateParams', '$state', 
	function($rootScope, $scope,  Appointment, $stateParams, $state) { 
    if($stateParams.method == 'edit')
    	Appointment.get(parseInt($stateParams.id)).then(function(data){
    		$scope.appointment = {};
            $scope.appointment.id = data.id;
            $scope.appointment.customer = data.customer;
            $scope.appointment.datetime = data.datetime;
    	});
    else
    	Appointment.getNew().then(function(data){
    		$scope.appointment = data;       
    	});
    $scope.saveAppointment = function(){
        Appointment.save($scope.appointment).then(function(data){
            $state.go('appointment');
        })
    }
    $scope.goBack = function(){
        $state.go('appointment');
    }
}]);
