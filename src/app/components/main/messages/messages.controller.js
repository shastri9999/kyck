'use strict';

function MessagesController($state, $scope, MessageService, Upload, AuthenticationService, $rootScope, $mdToast) {
	'ngInject';
	const vm = this;

	$scope.state = $state;
	$scope.$watch('state.current', function(state){
		if(state.name === 'main.messages'){
			$state.go('main.messages.inbox');
		}
	});

		vm.isBroker = AuthenticationService.isBroker();
	
    vm.addAttachment = function(file){
    	$rootScope.messageAttachment = file;
    };
    
    vm.removeAttachment = function(file){
    	$rootScope.messageAttachment = null;
    };

    vm.upload = function(messageId){       
      $rootScope.mainLoadingMessage = 'Sending Message... Please Wait.';
      $rootScope.mainLoading = true;
      Upload.upload({
        url: '/kyck-rest/usermessage/upload',
        data: {
          file: $rootScope.messageAttachment,
          messageId: messageId
        }
      }).then(function(response){
        $rootScope.mainLoading = false;
    	$rootScope.messageAttachment = null;        
      }, function(error){
    	$rootScope.messageAttachment = null;        
        $rootScope.mainLoading = false;
      }, function(evt){
	        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
    	    console.log(progressPercentage);
          });        
    };

		if (vm.isBroker)
		{
			MessageService.fetchToList().then((toList)=>{
				vm.toList  = toList;
			});
		}

		vm.refresh = ()=>{
			MessageService.refresh();
			$state.go('main.messages.inbox', {}, {reload: true});
			MessageService.unread().then((count)=>{
				$rootScope.unreadMessages = count;
				$rootScope.loadingProgress = false;
			});
		};
	
		vm.closeMessage = (messageType)=>{
			$rootScope.messageView['active' + messageType + 'Message'] = null;
			$rootScope.messageView.reply = "";
			vm.attachment = null;
		};

		vm.compose = ()=>{
			vm.composeMessage = {};
			$rootScope.messageView.reply = "";
			$rootScope.messageView.activeInboxMessage = null;
			$rootScope.messageView.activeSentMessage = null;
			$rootScope.messageView.composing = true;
	    	$rootScope.messageAttachment = null;        
		};

		vm.closeCompose = ()=>{
			vm.composeMessage = {};
			$rootScope.messageView.composing = false;
	    	$rootScope.messageAttachment = null;        
		};
	
		vm.sendMessage = (message, forSent)=>{
			if (!$rootScope.messageView.reply)
				return;
			MessageService.sendMessage(message, $rootScope.messageView.reply, forSent)
			.then((response)=>{
				if ($rootScope.messageAttachment)
					vm.upload(response.data.data.messageId);
				$rootScope.messageView.reply = "";
				$mdToast.showSimple('Message Successfully Sent!');
			});
		};

	vm.createMessage = ()=>{
		if (!vm.composeMessage.messageFrom || !vm.composeMessage.messageSubject || !vm.composeMessage.messageContent)
			return;
		MessageService.sendMessage(vm.composeMessage, vm.composeMessage.messageContent)
		.then((response)=>{
			if ($rootScope.messageAttachment)
				vm.upload(response.data.data.messageId);
			vm.closeCompose();
			$mdToast.showSimple('Message Successfully Sent!');
		});
	};

}

export default MessagesController;