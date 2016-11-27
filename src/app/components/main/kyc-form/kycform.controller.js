'use strict';

class KYCFormController {
	constructor(UserService, CurrencyService, $rootScope) {
		'ngInject';
		this.UserService = UserService;
		this.currencies = CurrencyService.currencies;
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
				this.fields.forEach((field)=>{
					if (field.actualType == "CURRENCY" && !field.prefix)
					{
						field.prefix = "SGD";
					}
				});
			});
		}
	}
}

export default KYCFormController;