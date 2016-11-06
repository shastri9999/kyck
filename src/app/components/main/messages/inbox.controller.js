'use strict';

function InboxController(MessageService, $rootScope) {
	'ngInject';
	const vm = this;
	MessageService.fetchInbox().then((messages)=>{
		vm.messages = messages;
	});
	
	vm.openMessage = (message)=>{
		$rootScope.messageView.activeInboxMessage = message;
	};
}

export default InboxController;