'use strict';

function BrokerageController($mdStepper) {
	'ngInject';

	var vm=this;
	init();

	function init() {
		vm.selectedTab = 1;
		vm.nextStep = nextStep;
		vm.backStep = backStep;
	}

	function nextStep() {
		console.log("oka 1");
		var steppers = $mdStepper('stepper-demo');
		steppers.next();
	}

	function backStep() {
		console.log("oka 2");
		var steppers = $mdStepper('stepper-demo');
		steppers.back();
	}

	// $scope.labels = ["Done", "Remaining"];
 //  	$scope.data = [20, 80];
 //  	$scope.colors = ['#3aafa6','#e2edef'];
}

export default BrokerageController;