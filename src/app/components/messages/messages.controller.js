'use strict';

function MessagesController($log, $scope, MessageResource, AuthenticationService) {
	'ngInject';
	var vm = this;
	vm.tabs = [
		{
			title: 'Inbox'
		},
		{
			title: 'Sent'
		},
		{
			title: 'Draft'
		}
	];

	vm.currentMessage = null;


	$scope.message = {
		from: 'Standard Chartered Bank',
		body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
		time: '2hr Ago'
	};

	vm.showReplyScreen = function(message){
		$log.debug("Email clicked");
		vm.currentMessage = message;
	}


	console.log(AuthenticationService.getLoggedInUser());
	var inbox = MessageResource.inbox();
	$log.debug(inbox);
}

export default MessagesController;