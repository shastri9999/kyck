'use strict';

function DashboardController (DashboardResource, AuthenticationService) {
	'ngInject';
	const vm=this;
	vm.isBroker = AuthenticationService.ifBroker();

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
}

export default DashboardController;