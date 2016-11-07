'use strict';

class ProfileFormController {
	constructor(UserService) {
		'ngInject';
		this.UserService = UserService;
		this.fields = {};
		this.UserService.getProfileFields().then((fields)=>{
			this.fields = fields;
		});
	}
}

export default ProfileFormController;