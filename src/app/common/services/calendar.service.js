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
			url: this.URL + '/calender/get/latestuserappointments',
		}).then((response)=>{
			this._$rootScope.loadingProgress=false;
			this.slots = response.data.data;
			return this.slots || [];
		});
	}

	fetchBrokerMeetings(){
		this._$rootScope.loadingProgress=true;
		return this._$http({
			method: 'GET',
			url: this.URL + '/calender/get/latestbrokerappointments',
		}).then((response)=>{
			this._$rootScope.loadingProgress=false;
			this.meetings = response.data.data;
			return this.meetings;
		});
	}

	updateAppointmentStatus(calendarDetailRequest) {
		this._$rootScope.loadingProgress = true;
		return this._$http({
			method: 'POST',
			url: this.URL + '/calendar/update/appointmentstatus',
			data: calendarDetailRequest
		}).then((response)=>{
			this._$rootScope.loadingProgress=false;
			return response.data;
		})
	}
}

export default CalendarService;