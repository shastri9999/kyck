'use strict';


class CalendarService{
	constructor($http, AppConstants) {
		'ngInject';
		this._$http = $http;
		this.URL = AppConstants.URL;
		this.slots = [];
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
}

export default CalendarService;