'use strict';
import users from '../../mockdata/users.json';

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
		this.loggedInUser = users[userId];
		this._StorageService.setItem('loggedInUser', this.loggedInUser);
	}

	logout(){
		this.loggedInUser = {};
		this._StorageService.setItem('loggedInUser', this.loggedInUser);
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