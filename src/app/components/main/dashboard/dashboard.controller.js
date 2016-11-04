'use strict';

class DashboardController {
	constructor(AuthenticationService){
		'ngInject'
		this.isUser = (AuthenticationService.getLoggedInUser().userType === 'USER');
	}
}
export default DashboardController;