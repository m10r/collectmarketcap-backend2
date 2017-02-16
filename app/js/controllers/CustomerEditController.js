/* Setup general page controller */
angular.module('App').controller('CustomerEditController',
 ['$rootScope', '$scope', 'settings', 'Customer', '$stateParams', '$state', 
	function($rootScope, $scope, settings, Customer, $stateParams, $state) {
    $scope.$on('$viewContentLoaded', function() {   
    	// initialize core components
    	App.initAjax();

    	// set default layout mode
    	$rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
    if($stateParams.method == 'edit')
    	Customer.get($stateParams.id).then(function(data){
    		$scope.customer = data;
    	});
    else
    	Customer.getNew($stateParams.id).then(function(data){
    		$scope.customer = data;
    	});
    $scope.saveCustomer = function(){
    	Customer.getNew($stateParams.id).then(function(data){
    		$state.go('customer');
    	});
    }
}]);
