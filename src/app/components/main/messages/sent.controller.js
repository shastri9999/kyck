'use strict';

function SentController(MessageService, $rootScope) {
	'ngInject';
	const vm = this;
	vm.messageLimit = 5;
	vm.pages = 0;
	vm.currentPage = 1;

	MessageService.fetchSent().then((messages)=>{
		vm.messages = messages;
		vm.pages = Math.floor(vm.messages.length / vm.messageLimit);
		if (vm.messages.length % vm.messageLimit)
		{
			vm.pages += 1;
		}

	});

	vm.next = ()=>{
		if(vm.currentPage < vm.pages)
		{
			vm.currentPage += 1;
		}
	}

	vm.previous = ()=>{
		if(vm.currentPage > 1)
		{
			vm.currentPage -= 1;
		}
	}


	vm.openMessage = (message)=>{
		$rootScope.messageView.reply = "";
		$rootScope.messageView.activeSentMessage = message;
		$rootScope.messageView.composing = false;
	};
}

export default SentController;