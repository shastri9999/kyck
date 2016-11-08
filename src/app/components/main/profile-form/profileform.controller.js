'use strict';

class ProfileFormController {
	constructor(UserService) {
		'ngInject';
		this.UserService = UserService;
		this.userFields = [];
		this.fields = [];
		if(this.isBroker)
		{
			this.UserService.getBrokerageDetails(this.userEmailId, 'user').then((fields)=>{
				this.userFields = fields;
			});
			this.UserService.getBrokerageDetails(this.userEmailId, 'profile').then((fields)=>{
				this.fields = fields;
			});
		}
		else
		{
			this.UserService.getUserFields().then((fields)=>{
				this.userFields = fields;
			});
			this.UserService.getProfileFields().then((fields)=>{
				this.fields = fields;
			});			
		}

	}
}

export default ProfileFormController;