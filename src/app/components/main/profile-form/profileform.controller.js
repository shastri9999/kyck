'use strict';

class ProfileFormController {
	constructor(UserService, $rootScope, PhoneService) {
		'ngInject';
		this.UserService = UserService;
		this.userFields = [];
		this.fields = [];
		this._$rootScope = $rootScope;
		this.phoneExtenstions = PhoneService.phoneExtensions;
		if(this.isBroker)
		{
			this._$rootScope.loadingProgress = true;
			this.UserService.getBrokerageDetails(this.userEmailId, 'user').then((fields)=>{
				this._$rootScope.loadingProgress = false;
				this.userFields = fields;
			});
			this.UserService.getBrokerageDetails(this.userEmailId, 'profile').then((fields)=>{
				this._$rootScope.loadingProgress = false;
				this.fields = fields;
			});
		}
		else
		{
			this._$rootScope.loadingProgress = true;

			this.UserService.getUserFields().then((fields)=>{
				this._$rootScope.loadingProgress = false;
				this.userFields = fields;
				this.userFields.forEach((field)=>{
					if (field.key == 'userPhone')
					{
						field.prefix = "+61";
						PhoneService.getExtension().then((extension)=>{
							field.prefix = extension.ext;
						});
					}
				});
			});
			this.UserService.getProfileFields().then((fields)=>{
				this._$rootScope.loadingProgress = false;
				this.fields = fields;
			});			
		}

	}
}

export default ProfileFormController;