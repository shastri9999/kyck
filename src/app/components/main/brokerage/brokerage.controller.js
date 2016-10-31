'use strict';

function BrokerageController($scope) {
	'ngInject';

	$scope.labels = ["Done", "Remaining"];
  	$scope.data = [20, 80];
  	$scope.colors = ['#3aafa6','#e2edef'];
}

export default BrokerageController;