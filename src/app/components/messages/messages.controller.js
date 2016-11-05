'use strict';
import $ from 'jquery';

function MessagesController($log, $scope, MessageResource, AuthenticationService) {
	'ngInject';
	var vm = this;
	vm.tabs = [
		{
			title: 'Inbox'
		},
		{
			title: 'Sent'
		},
		{
			title: 'Draft'
		}
	];

	vm.currentMessage = null;
	vm.activeTab = vm.tabs[0];

	vm.setActive = function(tab){
		vm.activeTab = tab;
	}


	$scope.message = {
		from: 'Standard Chartered Bank',
		body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
		time: '2hr Ago'
	};

	vm.showReplyScreen = function(message){
		$log.debug("Email clicked");
		vm.currentMessage = message;
	}
	$.ajax({
		method: 'POST',
		headers: {                   
		"Content-Type": "application/json"   
		},  
		data: JSON.stringify({
		userId: "user1@user.com",
		userPassword: "test123"
		}),
		crossDomain: true,
		url:"http://localhost:8080/kyck-rest/user/login/action",
		success: function(s){
		console.log(s);
	    /* Get logged in user data */
	        $.ajax({
	        method: 'GET',
	        headers: {                   
	        "Content-Type": "application/json"   
	        },  
	        crossDomain: true,
	        withCredentials: true,
	        url:"http://localhost:8080/kyck-rest/user/get/action",
	        success: function(s){
	        console.log(s);
	        },
	        failure: function(f){
	        console.log(f)
	        }
	      })
		},
		failure: function(f){
		console.log(f)
		}
	})



	console.log(AuthenticationService.getLoggedInUser());

}

export default MessagesController;