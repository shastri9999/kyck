'use strict';

class SignUpController {
	constructor(AuthenticationService, PhoneService, $state, $scope, $rootScope){
		'ngInject';

		this._AuthenticationService = AuthenticationService;
		this._$state = $state;
		this._$scope = $scope;
		this._$rootScope = $rootScope;
		this.invalidCredentials = false;
		PhoneService.getExtension().then((extension)=>{
			$scope.phoneExtenstion = extension.ext;
		});
		this.phoneExtenstions = PhoneService.phoneExtensions;
		this.signedUp = false;
		this._$rootScope.terms.agreeEnabled = false;
		this._$rootScope.terms.agree = false;
		this._$rootScope.terms.show = false;

	}

	signUp(){
		const scope = this._$scope;
		if (this._$rootScope.terms.agree)
		{
			this.invalidCredentials = false;
			const phone = scope.phoneExtenstion + "~" + scope.phonenumber;
			this._AuthenticationService.register(scope.firstname, scope.lastname, phone, scope.username).then((data)=>{
				this.signedUp = true;
				this._$rootScope.loadingProgress=false;
			}).catch((e)=>{
				this.signedUp = false;
				this._$rootScope.loadingProgress=false;
			})
		}
		else
		{
			this.invalidCredentials = true;
		}

	}

}

export default SignUpController;