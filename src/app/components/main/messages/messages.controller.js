'use strict';

function MessagesController($state, $scope, MessageService, $rootScope) {
	'ngInject';
	const vm = this;

	$scope.state = $state;
	$scope.$watch('state.current', function(state){
		if(state.name === 'main.messages'){
			$state.go('main.messages.inbox');
		}
	});

	vm.refresh = ()=>{
		MessageService.refresh();
		$state.go('main.messages.inbox', {}, {reload: true});
	}
	
	vm.closeMessage = (messageType)=>{
		$rootScope.messageView['active' + messageType + 'Message'] = null;
	}

}

export default MessagesController;