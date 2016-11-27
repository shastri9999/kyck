'use strict';

class SignInController {
	constructor(AuthenticationService, $state, $scope, $rootScope){
		'ngInject';

		this._AuthenticationService = AuthenticationService;
		this._$state = $state;
		this._$scope = $scope;
		this._$rootScope = $rootScope;
		this.invalidCredentials = false;
		$scope.$watchGroup(['username', 'password'], ()=>{
			this.invalidCredentials = false;
		});
	}

	signIn(){
		const scope = this._$scope;
		const username = scope.username;
		const password = scope.password;
		this._$rootScope.loadingProgress = true;

		if (username)
		{
			this.invalidCredentials = false;
			this._AuthenticationService.login(username, password).then((userData)=>{
				this._$rootScope.loadingProgress = false;
				if (this._AuthenticationService.isIA()) {
					this._$state.go('main.help');
				}
				else {
					this._$state.go('main.dashboard');			
				}
			}).catch((e)=>{
				this._$rootScope.loadingProgress = false;
				if (this._AuthenticationService.signedInUser)
				{
					this._$state.go('access.change-password');
				}
				else
				{
					this.invalidCredentials = true;
				}
			});
		}
		else
		{
			this.invalidCredentials = true;
		}
	}

}

export default SignInController;