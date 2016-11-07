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
		this.userDetails = [];
		this._userDetails = [];
		this.userFetched = false;
	}

	getUserFields(){
		if (this.kycFetched)
		{
			return new Promise((resolve)=>{
				resolve(this.userDetails);
			});
		}
		else
		{
			return this._$http({
				method: 'GET',
				url: this.URL + '/user/get/action'
			}).then((response)=>{
				const data = response.data.data;
				const keyMappings =  {
				    "userId": {description: "Email Address", disabled: true},
				    "userFname": {description: "First Name", disabled: false},
				    "userLname": {description: "Last Address", disabled: false},
				    "userPhone": {description: "Phone Number", disabled: false},
				}
				this._userDetails = Object.keys(data).map((key)=>{
					if (keyMappings[key])
					{
						return {
							key,
							...keyMappings[key],
							value: data[key]
						}
					}
					return null;
				}).filter(x=>!!x);
				this.userDetails = angular.copy(this._userDetails);
				this.userFetched = true;
				return this.userDetails;
			});
		}
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
		this.kycDetails = angular.copy(this._kycDetails)
	}

	clearUserFields(){
		this.userDetails = angular.copy(this._userDetails)
	}

	clearProfileFields(){
		this.profileDetails = angular.copy(this._profileDetails)
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