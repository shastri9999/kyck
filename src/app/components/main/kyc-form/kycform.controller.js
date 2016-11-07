'use strict';

class KYCFormController {
	constructor(UserService) {
		'ngInject';
		this.UserService = UserService;
		this.fields = {};
		this.UserService.getKYCFields().then((fields)=>{
			this.fields = fields;
		});
	}
}

export default KYCFormController;