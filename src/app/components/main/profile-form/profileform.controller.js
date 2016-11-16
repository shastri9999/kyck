'use strict';

class ProfileFormController {
	constructor(UserService, $rootScope) {
		'ngInject';
		this.UserService = UserService;
		this.userFields = [];
		this.fields = [];
		this._$rootScope = $rootScope;
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
			});
			this.UserService.getProfileFields().then((fields)=>{
				this._$rootScope.loadingProgress = false;
				this.fields = fields;
			});			
		}

	}
}

export default ProfileFormController;