'use strict';

function DashboardController (DashboardResource, AuthenticationService, MessageService, CalendarService, $rootScope, $state, moment) {
	'ngInject';
	const vm=this;
	vm.isBroker = AuthenticationService.isBroker();
	vm.bgurl = AuthenticationService.getBGURL();
	$rootScope.loadingProgress = false;

	if (vm.isBroker)
	{
		/* Get broker related info */

		vm.userAppointments = [];
		vm.userAppointmentsLimit = 3;
		vm.userAppointmentsShowMore = function(){
			vm.userAppointmentsLimit = Math.max(vm.userAppointments.length, 3);
		}

		vm.userAppointmentsShowLess = function(){
			vm.userAppointmentsLimit = 3;
		}

		DashboardResource.userAppointments((response)=>{
			vm.userAppointments = response.data;
		}, (error)=>{
			$rootScope.$broadcast('logout');
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

	vm.goToRequests =()=>{
		$state.go('main.brokerage');
	}

	vm.openMessage = (message)=>{
		$rootScope.messageView.activeInboxMessage = message;
		$rootScope.messageView.reply = "";
		$rootScope.messageView.composing = false;
		$state.go('main.messages');
	};
}

export default DashboardController;