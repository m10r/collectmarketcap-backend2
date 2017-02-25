/* Setup general page controller */
angular.module('App').controller('CustomerController', ['$rootScope', '$scope', 'Customer', '$state', function($rootScope, $scope, Customer, $state) {
    $scope.customers = [];
    $scope.newCustomer = function(){
    	$state.go('customer-edit', {method:'new'});
    }
    $scope.deleteCustomer = function(id){
    	if(confirm("Delete this customer?"))
    		Customer.delete(id).then(function(customer){
    			alert("Successfully deleted");
    			$state.reload();
    		});
    }
    Customer.GetCustomerList().then(function(data){
    	$scope.customers = data;
    });
}]);
