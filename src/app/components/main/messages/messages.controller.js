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
    
    vm.upload = function(file){       
      $rootScope.mainLoading = true;
      $rootScope.mainLoadingMessage = "Document is being uploaded... Please wait."

      Upload.upload({
        url: '/kyck-rest/usermessage/upload',
        data: {
          file: file,
          messageId: 26
        }
      }).then(function(response){
        console.log(response);
        console.log('Success: ' + response.config.data.file.name + 'Uploaded. Response: ' + response.data);
        $rootScope.mainLoading = false;
        $mdToast.show(
          $mdToast.simple()
          .textContent('File Uploaded Successfully!')
          .position('bottom left')
          .toastClass('md-primary')
          );
      }, function(error){
        console.log(error);
        $rootScope.mainLoading = false;
        $mdToast.show(
          $mdToast.simple()
          .textContent('File Upload Failed!')
          .position('bottom right')
          .toastClass('md-warn')
          .hideDelay(2000)
          );

      }, function(evt){
	        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
    	    console.log(progressPercentage);
          });        
    }

	if (vm.isBroker)
	{
		MessageService.fetchToList().then((toList)=>{
			vm.toList  = toList;
		});
	}

	vm.refresh = ()=>{
		MessageService.refresh();
		$state.go('main.messages.inbox', {}, {reload: true});
		$rootScope.loadingProgress = false;
	}
	
	vm.closeMessage = (messageType)=>{
		$rootScope.messageView['active' + messageType + 'Message'] = null;
		$rootScope.messageView.reply = "";
	}

	vm.compose = ()=>{
		vm.composeMessage = {};
		$rootScope.messageView.reply = "";
		$rootScope.messageView.activeInboxMessage = null;
		$rootScope.messageView.activeSentMessage = null;
		$rootScope.messageView.composing = true;
	}

	vm.closeCompose = ()=>{
		vm.composeMessage = {};
		$rootScope.messageView.composing = false;		
	}
	
	vm.sendMessage = (message, forSent)=>{
		if (!$rootScope.messageView.reply)
			return;
		MessageService.sendMessage(message, $rootScope.messageView.reply, forSent)
		.then(()=>{
			$rootScope.messageView.reply = "";
			$mdToast.showSimple('Message Successfully Sent!');
		});
	}

	vm.createMessage = ()=>{
		if (!vm.composeMessage.messageFrom || !vm.composeMessage.messageSubject || !vm.composeMessage.messageContent)
			return;
		MessageService.sendMessage(vm.composeMessage, vm.composeMessage.messageContent)
		.then(()=>{
			vm.closeCompose();
			$mdToast.showSimple('Message Successfully Sent!');
		});
	}

}

export default MessagesController;