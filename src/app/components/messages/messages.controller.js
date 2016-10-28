'use strict';

function MessagesController($log, $scope) {
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
}

export default MessagesController;