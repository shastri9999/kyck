'use strict';

function SettingsController($scope,$state) {
	'ngInject';
	$scope.state = $state;
	$scope.$watch('state.current', function(state){
		if(state.name === 'main.settings'){
			$state.go('main.settings.profile');
		}
	});

}

export default SettingsController;