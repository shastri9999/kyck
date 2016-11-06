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
		this.flagShow = false;

		this.flags = [{
			country: 'SG',
			url: '/assets/images/flag.png'
		},{
			country: 'ID',
			url: '/assets/images/flag-indonesia.png'
		},{
			country: 'TH',
			url: '/assets/images/flag-thailand.svg'
		}];
		this.activeFlag = this.flags[0];
	}

	selectFlag(flag){
		this.activeFlag = flag;
	}

	flagClose(){
		this.flagShow = false;
	}

	signOut(){
		this._AuthenticationService.logout().then(()=>{
			this._$state.go('access.signin');
		});
	}

}

export default ToolBarController;