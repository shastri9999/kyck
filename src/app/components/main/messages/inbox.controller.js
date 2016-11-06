'use strict';

function InboxController(MessageService) {
	'ngInject';
	const vm = this;
	MessageService.fetchInbox().then((messages)=>{
		vm.messages = messages;
	});
}

export default InboxController;