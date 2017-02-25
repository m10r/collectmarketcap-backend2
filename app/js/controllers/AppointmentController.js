/* Setup general page controller */
angular.module('App').controller('AppointmentController', ['$rootScope', '$scope', 'Appointment', '$state', function($rootScope, $scope, Appointment, $state) {
    $scope.appointments = [];
    $scope.newAppointment = function(){
    	$state.go('appointment-edit', {method:'new'});
    }
    $scope.deleteAppointment = function(id){
    	if(confirm("Delete this appointment?"))
    		Appointment.delete(id).then(function(appointment){
    			alert("Successfully deleted");
    			$state.reload();
    		});
    }
    Appointment.GetAppointmentList().then(function(data){
    	$scope.appointments = data;
    })
    .then(function(data){
    	
    });
}]);
