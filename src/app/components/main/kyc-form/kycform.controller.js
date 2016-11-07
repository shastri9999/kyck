'use strict';

class KYCFormController {
	constructor(UserService) {
		'ngInject';
		this.UserService = UserService;
		this.fields = {};
		if (this.isBroker)
		{
			this.UserService.getBrokerageDetails(this.userEmailId, 'kyc').then((fields)=>{
				this.fields = fields;
			});
		}
		else
		{
			this.UserService.getKYCFields().then((fields)=>{
				this.fields = fields;
			});
		}
	}
}

export default KYCFormController;