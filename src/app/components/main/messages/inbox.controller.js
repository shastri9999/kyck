'use strict';

function InboxController(MessageService, $rootScope) {
	'ngInject';
	const vm = this;
	vm.messageLimit = 5;
	vm.pages = 0;
	vm.currentPage = 1;

	MessageService.fetchInbox().then((messages)=>{
		vm.messages = messages;
		if (typeof messages === "string")
		{
			vm.messages = [];
		}
		vm.pages = Math.floor(vm.messages.length / vm.messageLimit);
		if (vm.messages.length % vm.messageLimit)
		{
			vm.pages += 1;
		}
		$rootScope.loadingProgress = false;
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
		$rootScope.messageView.activeInboxMessage = message;
		$rootScope.messageView.composing = false;
		$rootScope.messageAttachment = null;
		if (message.messageStatus === 'UNREAD')
		{
			MessageService.getMail(message.messageId).then(()=>{
				message.messageStatus = "READ";
				$rootScope.unreadMessages -= 1;	
			});
		}
	};
}

export default InboxController;