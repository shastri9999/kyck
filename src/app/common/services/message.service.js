'use strict';


class MessageService{
	constructor($http, AppConstants) {
		'ngInject';
		this._$http = $http;
		this.URL = AppConstants.URL + '/usermessage';
		this.sent = [];
		this.inbox = [];
		this.messagesFetched = false;
	}

	fetchInbox(){
		return this._$http({
			method: 'GET',
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
}

export default MessageService;