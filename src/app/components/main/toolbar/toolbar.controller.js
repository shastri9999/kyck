'use strict';

class ToolBarController {
	constructor(AuthenticationService, $state, $filter){
		'ngInject';
		
		const loggedInUser = AuthenticationService.getLoggedInUser();
		const capitalize = $filter('capitalize');

		this._AuthenticationService = AuthenticationService;
		this._$state = $state;
		this.userType = loggedInUser.userType;
		this.displayName = [ loggedInUser.userFname, loggedInUser.userLname].map(capitalize).join(' ');
	}

	signOut(){
		this._AuthenticationService.logout();
		this._$state.go('access.signin');
	}

}

export default ToolBarController;