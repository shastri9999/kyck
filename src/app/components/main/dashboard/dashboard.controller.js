'use strict';

function DashboardController (DashboardResource, AuthenticationService, MessageService) {
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
}

export default DashboardController;