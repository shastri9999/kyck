'use strict';

function DashboardController (DashboardResource, AuthenticationService, MessageService, $rootScope, $state) {
	'ngInject';
	const vm=this;
	vm.isBroker = AuthenticationService.isBroker();

	if (vm.isBroker)
	{
		/* Get broker related info */

		DashboardResource.userAppointments((response)=>{
			vm.userAppointments = response.data;
		});
	}
	else
	{
		/* Get user related info */
		DashboardResource.brokerAppointments((response)=>{
			vm.brokerAppointments = response.data;
		});

		DashboardResource.brokerageApplications((response)=>{
			vm.brokerageApplications = response.data;
		});
	}
	
	MessageService.fetchInbox().then((messages)=>{
		vm.messages = messages;
	})

	vm.openMessage = (message)=>{
		$rootScope.messageView.activeMessage = message;
		$state.go('main.messages');
	};

}

export default DashboardController;