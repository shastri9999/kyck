'use strict';

class SignUpController {
	constructor(AuthenticationService, PhoneService, $state, $scope, $rootScope){
		'ngInject';

		this._AuthenticationService = AuthenticationService;
		this._$state = $state;
		this._$scope = $scope;
		this._$rootScope = $rootScope;
		this.invalidCredentials = false;
		$scope.phoneExtenstion = PhoneService.selectedExtension.ext;
		this.phoneExtenstions = PhoneService.phoneExtensions;
		console.log(PhoneService.phoneExtenstions)
	}

	signUp(){
		const scope = this._$scope;
		if (this._$rootScope.terms.agree)
		{
			this.invalidCredentials = false;
		}
		else
		{
			this.invalidCredentials = true;
		}

	}

}

export default SignUpController;