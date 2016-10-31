'use strict';

function MessagesController($log, $scope, MessageResource, AuthenticationService) {
	'ngInject';
	$log.debug('Always use $log.debug for console logs for debugging');
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
	console.log(AuthenticationService.getLoggedInUser());
	var inbox = MessageResource.inbox();
	$log.debug(inbox);
}

export default MessagesController;