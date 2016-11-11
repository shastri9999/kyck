'use strict';


class DocumentService{
	constructor($http, AppConstants) {
		'ngInject';
		this._$http = $http;
		this.URL = AppConstants.URL;
		this.slots = [];
		this.meetings = [];
	}

	fetchMeetings(userEmailId, month){
		return this._$http({
			method: 'GET',
			params: {
				userEmailId,
				month
			},
			url: this.URL + '/user/meeting/month',
		}).then((response)=>{
			this.slots = response.data[userEmailId];
			return this.slots;
		});
	}

	fetchBrokerMeetings(){
		return this._$http({
			method: 'GET',
			url: this.URL + '/dashboard/users/appointments',
		}).then((response)=>{
			this.meetings = response.data.data;
			return this.meetings;
		});
	}
}

export default DocumentService;