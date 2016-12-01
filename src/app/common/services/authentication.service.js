'use strict';

class AuthenticationService {
constructor($http, AppConstants, $rootScope, StorageService, $state, UserService) {
		'ngInject';
		this._$http = $http;
		this._AppConstants = AppConstants;
		this._$rootScope = $rootScope;
		this.loggedInUser = {};
		this._StorageService = StorageService;
		this._UserService = UserService;
		this.signedInUser = {};
	}

	reset(userId) {
		this._$rootScope.loadingProgress=true;
		return this._$http({
			method: 'POST',
			url: '/kyck-rest/user/reset-password/action',
			data: {
				userId
			}
		}).then((response)=>{
			return response.data.data;
		});
	}

	setPassword(userPassword) {
		this._$rootScope.loadingProgress=true;
		return this._$http({
			method: 'POST',
			url: '/kyck-rest/user/set-password/action',
			data: {
				userPassword: userPassword
			}
		}).then((response)=>{
			const userData = response.data.data;
			this.loggedInUser = this.signedInUser;
			this._StorageService.setItem('loggedInUser', this.signedInUser);
			this.signedInUser = null;
			return this.signedInUser;
		});
	}

	register(firstname, lastname, phone, email) {
		this._$rootScope.loadingProgress=true;
		return this._$http({
			method: 'POST',
			url: '/kyck-rest/user/register/action',
			data: {
			  "userFname": firstname,
			  "userId":  email,
			  "userLname": lastname,
			  "userPhone": phone,
			  "userType": "USER"
			}
		}).then((response)=>{
			this.signedInUser = null;
			return response.data.data;
		});
	}

	login(userId, userPassword) {
		this._$rootScope.loadingProgress=true;
		return this._$http({
			method: 'POST',
 			url: '/kyck-rest/user/login/action',
 			data: {
 				userId,
  				userPassword 
 			}
		}).then((response)=>{
			const userData = response.data.data;
			if (! userData.userType) {
				this.signedInUser = null;
				return new Promise((resolve, reject)=>{reject("Invalid Credentials");});
			}
			else if (userData.status === "REGISTERED") {
				this.signedInUser = userData;
				return new Promise((resolve, reject)=>{reject(userData);});
			}
			else {
				this.signedInUser = null;
				this.loggedInUser = userData;
				this._StorageService.setItem('loggedInUser', this.loggedInUser);
			}
			this._$rootScope.loadingProgress=false;
			return userData;
		});
	}

	logout(){
		this._$rootScope.loadingProgress=true;
		this._UserService.reInit();
		return this._$http({
			method: 'POST',
 			url: '/kyck-rest/user/logout/action',
		}).then((response)=>{
			this._$rootScope.loadingProgress=false;
			this.loggedInUser = null;
			this.signedInUser = null;
			this._StorageService.setItem('loggedInUser', this.loggedInUser);
		}).catch(()=>{
			this._$rootScope.loadingProgress=false;
			this.loggedInUser = null;
			this.signedInUser = null;
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