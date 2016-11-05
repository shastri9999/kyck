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
		const username = scope.username;
		const password = scope.password;

		if (username)
		{
			this.invalidCredentials = false;
			this._AuthenticationService.login(username, password).then(()=>{
				this._$state.go('main.dashboard');			
			}).catch((e)=>{
				console.log(e);
				this.invalidCredentials = true;
			});
		}
		else
		{
			this.invalidCredentials = true;
		}
	}

}

export default SignInController;