'use strict';

function MessagesController($state, $scope) {
	'ngInject';
	$scope.state = $state;
	$scope.$watch('state.current', function(state){
		if(state.name === 'main.messages'){
			$state.go('main.messages.inbox');
		}
	});
}

export default MessagesController;