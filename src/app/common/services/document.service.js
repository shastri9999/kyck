'use strict';


class DocumentService{
	constructor($http, AppConstants, $rootScope) {
		'ngInject';
		this._$http = $http;
		this.URL = AppConstants.URL;
		this.slots = [];
		this.meetings = [];
	}

	fetchMeetings(userEmailId, month){
		$rootScope.loadingProgress=true;
		return this._$http({
			method: 'GET',
			params: {
				userEmailId,
				month
			},
			url: this.URL + '/user/meeting/month',
		}).then((response)=>{
			$rootScope.loadingProgress=false;
			this.slots = response.data[userEmailId];
			return this.slots;
		});
	}

	fetchBrokerMeetings(){
		$rootScope.loadingProgress=true;
		return this._$http({
			method: 'GET',
			url: this.URL + '/dashboard/users/appointments',
		}).then((response)=>{
			$rootScope.loadingProgress=false;
			this.meetings = response.data.data;
			return this.meetings;
		});
	}
}

export default DocumentService;