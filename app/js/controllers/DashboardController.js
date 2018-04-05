	
angular.module('App').controller('DashboardController', function($rootScope, $scope, $http, $timeout) {

	var baseUrl = location.protocol + '//' + location.hostname + ':4000';
	$scope.bitrextrades = [];
	$scope.idextrades = [];
	$scope.trades = [];
	$scope.status = null;
	$scope.rowCount = 0;
	$http.get(baseUrl + '/api/v1/trade/bittrex/trades').then(ms=>{
		$scope.bitrextrades = ms.data;
		$scope.bittrexSize = JSON.stringify($scope.bitrextrades).length / 1024 / 1024;
		$scope.bittrexSize = $scope.bittrexSize.toFixed(2);
	})

	$http.get(baseUrl + '/api/v1/trade/idex/trades').then(ms=>{
		$scope.idextrades = ms.data;
		$scope.idexSize = JSON.stringify($scope.idextrades).length / 1024 / 1024;
		$scope.idexSize = $scope.idexSize.toFixed(2);
	})


	$scope.toggleCron = function() {
		$scope.status = !$scope.status;
		$http.get(baseUrl + '/api/v1/trade/setCronStatus?tradeCron=' + $scope.status).then(ms=>{

		})	
	}

	$http.get(baseUrl + '/api/v1/trade/getCronStatus').then(ss=>{
		$scope.status = ss.data.tradeCron;
	})
});