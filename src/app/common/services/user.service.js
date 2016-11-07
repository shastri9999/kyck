'use strict';


class UserService{
	constructor($http, AppConstants) {
		'ngInject';
		this._$http = $http;
		this.URL = AppConstants.URL;
		this.kycDetails = [];
		this.profileDetails = [];
		this._kycDetails = [];
		this._profileDetails = [];
		this.kycFetched = false;
		this.profileFetched = false;
	}

	getKYCFields(){
		if (this.kycFetched)
		{
			return new Promise((resolve)=>{
				resolve(this.kycDetails);
			});
		}
		else
		{
			return this._$http({
				method: 'GET',
				url: this.URL + '/kyckuseranswer/findall/action'
			}).then((response)=>{
				this._kycDetails = response.data.data;
				this.kycDetails = angular.copy(this._kycDetails);
				this.kycFetched = true;
				return this.kycDetails;
			});
		}
	}

	clearKYCFields(){
		this.kycDetails = angular.copy(_this.kycDetails)
	}

	clearProfileFields(){
		this.profileDetails = angular.copy(_this.profileDetails)
	}

	getProfileFields(){
		if (this.profileFetched)
		{
			return new Promise((resolve)=>{
				resolve(this.profileDetails);
			});
		}
		else
		{
			return this._$http({
				method: 'GET',
				url: this.URL + '/userprofile/findall/action'
			}).then((response)=>{
				this._profileDetails = response.data.data;
				this.profileDetails = angular.copy(this._profileDetails);
				this.profileFetched = true;
				return this.profileDetails;
			});
		}
	}
}

export default UserService;