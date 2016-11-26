'use strict';

class ForgotPasswordController {
	constructor(AuthenticationService, $rootScope, $scope){
		'ngInject';

		this._AuthenticationService = AuthenticationService;
		this._$rootScope = $rootScope;
		this.scope = $scope;
		this.reset = false;
		this.invalidCredentials = false;
	}

	resetPassword(){
		if (this._$rootScope.loadingProgress)
			return;
		const username = this.scope.username;
		console.log(this.scope);
		this._AuthenticationService.reset(username).then((data)=>{
			this._$rootScope.loadingProgress = false;
			this.reset = true;
		}).catch((e)=>{
			this._$rootScope.loadingProgress = false;
			this.invalidCredentials = true;
			this.reset = false;
		});
	}

}

export default ForgotPasswordController;