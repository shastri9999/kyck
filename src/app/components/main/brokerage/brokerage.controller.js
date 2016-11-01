'use strict';

function BrokerageController() {
	'ngInject';

	var vm=this;
	init();

	function init() {
		vm.selectedTab = 1;
		vm.nextStep = nextStep;
	}

	function nextStep() {
		console.log("oka");
		vm.selectedTab += 1;
	}

	function backStep() {
		console.log("oka");
		vm.selectedTab -= 1;
	}

	// $scope.labels = ["Done", "Remaining"];
 //  	$scope.data = [20, 80];
 //  	$scope.colors = ['#3aafa6','#e2edef'];
}

export default BrokerageController;