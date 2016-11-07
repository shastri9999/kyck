'use strict';

function MessagesController($state, $scope, MessageService, AuthenticationService, $rootScope, $mdToast) {
	'ngInject';
	const vm = this;

	$scope.state = $state;
	$scope.$watch('state.current', function(state){
		if(state.name === 'main.messages'){
			$state.go('main.messages.inbox');
		}
	});

	vm.isBroker = AuthenticationService.isBroker();

	vm.refresh = ()=>{
		MessageService.refresh();
		$state.go('main.messages.inbox', {}, {reload: true});
	}
	
	vm.closeMessage = (messageType)=>{
		$rootScope.messageView['active' + messageType + 'Message'] = null;
		$rootScope.messageView.reply = "";
	}

	vm.compose = ()=>{
		vm.composeMessage = {};
		$rootScope.messageView.reply = "";
		$rootScope.messageView.activeInboxMessage = null;
		$rootScope.messageView.activeSentMessage = null;
		$rootScope.messageView.composing = true;
	}

	vm.closeCompose = ()=>{
		vm.composeMessage = {};
		$rootScope.messageView.composing = false;		
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

	vm.createMessage = ()=>{
		if (!vm.composeMessage.messageFrom || !vm.composeMessage.messageSubject || !vm.composeMessage.messageContent)
			return;
		MessageService.sendMessage(vm.composeMessage, vm.composeMessage.messageContent)
		.then(()=>{
			vm.closeCompose();
			$mdToast.showSimple('Message Successfully Sent!');
		});
	}

}

export default MessagesController;