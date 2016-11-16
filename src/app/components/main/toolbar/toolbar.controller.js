'use strict';

class ToolBarController {
	constructor(AuthenticationService, $state, $filter, MessageService, $rootScope){
		'ngInject';
		
		const loggedInUser = AuthenticationService.getLoggedInUser();
		const capitalize = $filter('capitalize');

		this._AuthenticationService = AuthenticationService;
		this._$state = $state;
		this._MessageService = MessageService;
		this.userType = loggedInUser.userType;
		this.displayName = [ loggedInUser.userFname, loggedInUser.userLname].map(capitalize).join(' ');
		this.avatarName = [ loggedInUser.userFname[0].toUpperCase(), loggedInUser.userLname[0].toUpperCase()].join('');
		this.flagShow = false;

        $rootScope.loadingProgress = true;
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

		$rootScope.$on('logout', ()=>{
			this.signOut();
		})

	}

	selectFlag(flag){
		this.activeFlag = flag;
	}

	flagClose(){
		this.flagShow = false;
	}

	signOut(){
		this._AuthenticationService.logout().then(()=>{
			this._MessageService.refresh();
			this._$state.go('access.signin');
		});
	}

}

export default ToolBarController;