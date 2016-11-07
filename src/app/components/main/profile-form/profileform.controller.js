'use strict';

class ProfileFormController {
	constructor(UserService) {
		'ngInject';
		this.UserService = UserService;
		this.userFields = [];
		this.fields = [];
		this.UserService.getUserFields().then((fields)=>{
			this.userFields = fields;
			console.log(fields);
		});
		this.UserService.getProfileFields().then((fields)=>{
			this.fields = fields;
		});

	}
}

export default ProfileFormController;