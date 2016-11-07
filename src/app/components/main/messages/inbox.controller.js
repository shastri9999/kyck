'use strict';

function InboxController(MessageService, $rootScope) {
	'ngInject';
	const vm = this;
	MessageService.fetchInbox().then((messages)=>{
		vm.messages = messages;
	});
	
	vm.openMessage = (message)=>{
		$rootScope.messageView.reply = "";
		$rootScope.messageView.activeInboxMessage = message;
		$rootScope.messageView.composing = false;
	};
}

export default InboxController;