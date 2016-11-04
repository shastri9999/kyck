'use strict';

class SignInController {
	constructor(AuthenticationService, $state, $scope){
		'ngInject';

		this._AuthenticationService = AuthenticationService;
		this._$state = $state;
		this._$scope = $scope;
		this.invalidCredentials = false;
		$scope.$watchGroup(['username', 'password'], ()=>{
			this.invalidCredentials = false;
		});
	}

	signIn(){
		const scope = this._$scope;
		const validUserNames = ['user1@user.com', 
								'user2@user.com', 
								'broker1@broker.com', 
								'broker2@broker.com'];
		const username = scope.username;

		if (username && validUserNames.indexOf(username)!=-1)
		{
			this.invalidCredentials = false;
			this._AuthenticationService.login(username);
			this._$state.go('main.dashboard');			
		}
		else
		{
			this.invalidCredentials = true;
		}
	}

}

export default SignInController;