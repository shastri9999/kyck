'use strict';

import LibPhoneNumber from 'google-libphonenumber';

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
		this.PhoneUtil = LibPhoneNumber.PhoneNumberUtil.getInstance();
	}

	validatePhone(extension, number)
	{
 		const phoneNumber = this.PhoneUtil.parse(number , this.PhoneUtil.getRegionCodeForCountryCode(extension.slice(1)));
 		return this.PhoneUtil.isValidNumber(phoneNumber);
	}
	signUp(){
		const scope = this._$scope;
		this.invalidPhone = false;
		if (!this.validatePhone(scope.phoneExtenstion, scope.phonenumber))
		{
			this.invalidPhone = true;
			return;
		}
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