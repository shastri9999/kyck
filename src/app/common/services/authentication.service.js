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
			console.log("USER DATA is", userData);
			this.loggedInUser = userData;
			this._StorageService.setItem('loggedInUser', this.loggedInUser);
			return userData;
		});
	}

	logout(){
		return this._$http({
			method: 'POST',
 			url: '/kyck-rest/user/logout/action',
		}).then((response)=>{
			this.loggedInUser = null;
			this._StorageService.setItem('loggedInUser', this.loggedInUser);
		}).catch(()=>{
			this.loggedInUser = null;
			this._StorageService.setItem('loggedInUser', this.loggedInUser);
		});
	}

	isBroker() {
		return this.getLoggedInUser().userType != "USER";
	}

	isBank() {
		return this.getLoggedInUser().userType === "BANK";	
	}

	isIA() {
		return this.getLoggedInUser().userType === "IA";
	}

	getType() {
		return this.getLoggedInUser().userType;
	}

	getLoggedInUser(){
		return this._StorageService.getItem('loggedInUser');
	}

	getBGURL() {
		var bgurl="";

		if (this.isBank()) {
			bgurl = '/assets/images/bankbg.jpg';
		} else if (this.isIA()) {
			bgurl = '/assets/images/iabg.jpg';
		} else {
			bgurl = '/assets/images/sidebar-background.png';
		}

		return bgurl;
	}
}

export default AuthenticationService;