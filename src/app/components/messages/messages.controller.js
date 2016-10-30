'use strict';

function MessagesController($log, $scope, Message) {
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

	var inbox = Message.inbox();
	$log.debug(inbox);
}

export default MessagesController;