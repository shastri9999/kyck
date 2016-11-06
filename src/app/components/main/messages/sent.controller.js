'use strict';

function SentController(MessageService) {
	'ngInject';
	const vm = this;
	MessageService.fetchSent().then((messages)=>{
		vm.messages = messages;
		console.log(messages);
	});
}

export default SentController;