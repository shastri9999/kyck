'use strict';


class UserService{
	constructor($http, AppConstants) {
		'ngInject';
		this._$http = $http;
		this._AppConstants = AppConstants;
	}
}

export default UserService;