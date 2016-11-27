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
						field.value = field.value || "";
						const parts = field.value.split("~");
						if (parts.length ==2)
						{
							field.value = parts[1];
							field.prefix = parts[0];
						}
						else
						{
							field.prefix = "+65";
							PhoneService.getExtension().then((extension)=>{
								field.prefix = extension.ext;
							});							
						}
					}
				});
			});
			this.UserService.getProfileFields().then((fields)=>{
				this._$rootScope.loadingProgress = false;
				this.fields = fields;
				this.fields.forEach((field)=>{
					if (field.actualType == 'PHONE')
					{
						if(!field.prefix)
						{
							field.prefix = "+65";
							PhoneService.getExtension().then((extension)=>{
								field.prefix = extension.ext;
							});							
						}
					}
				});
			});			
		}

	}
}

export default ProfileFormController;