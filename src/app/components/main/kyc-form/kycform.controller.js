'use strict';

class KYCFormController {
	constructor(UserService, $rootScope) {
		'ngInject';
		this.UserService = UserService;
		this.fields = {};
		this._$rootScope = $rootScope;

		if (this.isBroker)
		{
			this._$rootScope.loadingProgress = true;
			this.UserService.getBrokerageDetails(this.userEmailId, 'kyc').then((fields)=>{
				this._$rootScope.loadingProgress = false;
				this.fields = fields;
			});
		}
		else
		{
			this._$rootScope.loadingProgress = true;
			this.UserService.getKYCFields().then((fields)=>{
				this._$rootScope.loadingProgress = false;
				this.fields = fields;
			});
		}
	}
}

export default KYCFormController;