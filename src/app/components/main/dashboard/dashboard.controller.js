'use strict';

function DashboardController (DashboardResource, AuthenticationService, MessageService, CalendarService, $rootScope, $state, moment) {
	'ngInject';
	const vm=this;
	vm.isBroker = AuthenticationService.isBroker();

	if (vm.isBroker)
	{
		/* Get broker related info */

		DashboardResource.userAppointments((response)=>{
			vm.userAppointments = response.data;
		});

		CalendarService.fetchBrokerMeetings().then((appointments)=>{
			vm.brokerAppointments = appointments.map((appointment)=>{
				appointment.displayTime = moment(appointment.startTime, 'DD/MM/YYYY hh:mm').format('MMM Do YY, hh:mm a');
				return appointment;
			});
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
		$rootScope.messageView.activeInboxMessage = message;
		$state.go('main.messages');
	};

}

export default DashboardController;