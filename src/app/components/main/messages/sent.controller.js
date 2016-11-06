'use strict';

function SentController(MessageService) {
	'ngInject';
	const vm = this;
	MessageService.fetchSent().then((messages)=>{
		vm.messages = messages;
	});
}

export default SentController;