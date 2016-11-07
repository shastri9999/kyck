'use strict';

function SentController(MessageService, $rootScope) {
	'ngInject';
	const vm = this;
	MessageService.fetchSent().then((messages)=>{
		vm.messages = messages;
	});

	vm.openMessage = (message)=>{
		$rootScope.messageView.reply = "";
		$rootScope.messageView.activeSentMessage = message;
	};
}

export default SentController;