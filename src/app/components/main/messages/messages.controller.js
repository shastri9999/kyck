'use strict';

function MessagesController($state, $scope, MessageService, $rootScope, $mdToast) {
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
		$rootScope.messageView.reply = "";
	}

	vm.sendMessage = (message, forSent)=>{
		if (!$rootScope.messageView.reply)
			return;
		MessageService.sendMessage(message, $rootScope.messageView.reply, forSent)
		.then(()=>{
			$rootScope.messageView.reply = "";
			$mdToast.showSimple('Message Successfully Sent!');
		});
	}

}

export default MessagesController;