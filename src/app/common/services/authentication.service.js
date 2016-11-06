'use strict';

class AuthenticationService {
	constructor($http, AppConstants, $rootScope, StorageService) {
		'ngInject';
		this._$http = $http;
		this._AppConstants = AppConstants;
		this._$rootScope = $rootScope;
		this.loggedInUser = {};
		this._StorageService = StorageService;
	}

	login(userId, userPassword) {
		return this._$http({
			method: 'POST',
 			url: '/kyck-rest/user/login/action',
 			data: {
 				userId,
  				userPassword 
 			}
		}).then((response)=>{
			const userData = response.data.data;
			this.loggedInUser = userData;
			this._StorageService.setItem('loggedInUser', this.loggedInUser);
			return userData;
		});
	}

	logout(){
		this.loggedInUser = null;
		this._StorageService.setItem('loggedInUser', this.loggedInUser);
	}

	ifBroker() {
		return this._StorageService.getItem('loggedInUser')['userType'] != "USER";
	}

	getLoggedInUser(){
		return this._StorageService.getItem('loggedInUser');
	}

	authorize(){
		if (!this.getLoggedInUser())
		{
			$state.go('access.signin');
		}
	}	
}

export default AuthenticationService;