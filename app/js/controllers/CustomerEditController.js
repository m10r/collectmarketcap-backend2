/* Setup general page controller */
angular.module('App').controller('CustomerEditController',
 ['$rootScope', '$scope',  'Customer', '$stateParams', '$state', 
	function($rootScope, $scope, Customer, $stateParams, $state) {
    if($stateParams.method == 'edit')
    	Customer.get($stateParams.id).then(function(data){
    		$scope.customer = {};
            $scope.customer.id = data.id;
            $scope.customer.firstname = data.firstname;
            $scope.customer.lastname = data.lastname;
    	});
    else
    	Customer.getNew().then(function(data){
    		$scope.customer = data;       
    	});
    $scope.saveCustomer = function(){
        Customer.save($scope.customer).then(function(data){
            $state.go('customer');
        })
    }
    $scope.goBack = function(){
        $state.go('customer');
    }
}]);
