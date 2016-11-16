'use strict';


class CalendarService{
	constructor($http, AppConstants, $rootScope) {
		'ngInject';
		this._$http = $http;
		this._$rootScope = $rootScope;
		this.URL = AppConstants.URL;
		this.slots = [];
		this.meetings = [];
	}

	fetchMeetings(userEmailId, month){
		this._$rootScope.loadingProgress=true;
		return this._$http({
			method: 'GET',
			params: {
				userEmailId,
				month
			},
			url: this.URL + '/user/meeting/month',
		}).then((response)=>{
			this._$rootScope.loadingProgress=false;
			this.slots = response.data.data;
			return this.slots;
		});
	}

	fetchBrokerMeetings(){
		this._$rootScope.loadingProgress=true;
		return this._$http({
			method: 'GET',
			url: this.URL + '/dashboard/users/appointments',
		}).then((response)=>{
			this._$rootScope.loadingProgress=false;
			this.meetings = response.data.data;
			return this.meetings;
		});
	}
}

export default CalendarService;