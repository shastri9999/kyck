'use strict';

function DashboardController (DashboardResource, AuthenticationService) {
	'ngInject';
	var vm=this;

	init();

	function init() {
		vm.ifBroker = AuthenticationService.ifBroker();
		DashboardResource.userAppointments(function(req){
			vm.userAppointments = req.data;
		}, function() {console.log("error");})
	}
}
export default DashboardController;