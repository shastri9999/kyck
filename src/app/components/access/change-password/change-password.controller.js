'use strict';

class ChangePasswordController {
	constructor(AuthenticationService, $rootScope, $scope){
		'ngInject';

		this._AuthenticationService = AuthenticationService;
		this._$rootScope = $rootScope;
		this.scope = $scope;
		this.reset = false;
		this.invalidCredentials = false;
		this.invalidPassword = false;
		$scope.$watchGroup(['confirmpassword', 'password'], ()=>{
			this.invalidCredentials = false;
			this.invalidPassword = false;
		});
	}

	changePassword(){
		if (this._$rootScope.loadingProgress)
			return;
		const password = this.scope.password;
		const confirm = this.scope.confirmpassword;
		this.invalidCredentials = false;
		this.invalidPassword = false;

		if (password.length < 8)
		{
			this.invalidPassword = true;
		}
		if (password != confirm)
		{
			this.invalidCredentials = true;
		}

		if (this.invalidPassword || this.invalidCredentials)
			return;

		this._AuthenticationService.setPassword(password).then((userData)=>{
			this._$rootScope.loadingProgress = false;
			if (this._AuthenticationService.isIA()) {
				this._$state.go('main.help');
			}
			else {
				this._$state.go('main.dashboard');			
			}
		}).catch((e)=>{
			this._$rootScope.loadingProgress = false;
			console.log(e);
		});
	}

}

export default ChangePasswordController;