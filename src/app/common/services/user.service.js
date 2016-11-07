'use strict';


class UserService{
	constructor($http, AppConstants, moment) {
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
		this.moment = moment;
	}

	transFormData(fields){
		return fields.map((field)=>{

			/* Mapping to make dropdown work */
			field.answerId = +field.answerId || 0;
			field.selectedValue = null;
			field.answersList.forEach((answer)=>{
				answer.answerId = +answer.answerId || 0;
				if (answer.answerId == field.answerId)
				{
					field.selectedValue = answer;
				}
			})

			/*Mapping to make date work */
			if (field.validationType === 'DATE')
			{
				field.answerText = this.moment(field.answerText, 'DD-Mo-YYYY').toDate();
			}

			/*Mapping to make numbers work */
			if (field.validationType === 'NUMBER')
			{
				field.answerText = +field.answerText.replace(',','')
			}

			return field;
		})
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
				this._kycDetails = this.transFormData(response.data.data);
				this.kycDetails = angular.copy(this._kycDetails);
				this.kycFetched = true;
				console.log(this.kycDetails);
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
				this._profileDetails = this.transFormData(response.data.data);
				this.profileDetails = angular.copy(this._profileDetails);
				this.profileFetched = true;
				return this.profileDetails;
			});
		}
	}

	saveKYCFields(){
		const requiredFilled = this.kycDetails.every((field)=>{
			if (field.requireField=="REQUIRED" && field.questionType==="TEXT")
			{
				return !!field.answerText;
			}
			if (field.requireField=="REQUIRED" && field.questionType!=="TEXT")
			{
				return !!field.selectedValue.answerId;
			}
			return true;
		});
		if (!requiredFilled)
		{
			return new Promise((resolve, reject)=>{
				reject(new Error("All fields marked * are required!"))
			})
		}
		return new Promise((resolve)=>{
			return {"status": "SUCCESS"}
		});
	}

	saveProfileFields(){
		const userDetailsFilled = this.userDetails.every((field)=>{
			return !!field.value;
		});

		const requiredFilled = this.profileDetails.every((field)=>{
			if (field.requireField=="REQUIRED" && ["TEXT", "NUMBER"].indexOf(field.questionType)>=0)
			{
				return !!field.answerText;
			}
			else if(field.requireField=="REQUIRED")
			{
				return !!field.selectedValue.answerId;
			}
			return true;
		});

		if (!requiredFilled || !userDetailsFilled)
		{
			return new Promise((resolve, reject)=>{
				reject(new Error("All fields marked * are required!"))
			})
		}
		else
		{

		}
		return new Promise((resolve)=>{
			resolve({"status": "SUCCESS"});
		});
	}

}

export default UserService;