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
		this.brokeragesDetail = {};
	}

	transFormData(fields){
		return fields.map((field)=>{

			/* Mapping to make dropdown work */
			field.answerId = +field.answerId || 0;
			field.selectedValue = null;
			
			field.answersList && field.answersList.forEach((answer)=>{
				answer.answerId = +answer.answerId || 0;
				if (answer.answerId == field.answerId)
				{
					field.selectedValue = answer;
				}
			})

			if(!field.answerText)
				return field;

			/*Mapping to make date work */
			if (field.validationType === 'DATE')
			{
				field.answerText = this.moment(field.answerText, 'DD-MM-YYYY').toDate();
			}

			/*Mapping to make numbers work */
			if (field.validationType === 'NUMBER')
			{
				field.answerText = +field.answerText.replace(',','')
			}

			return field;
		})
	}

	getBrokerageDetails(email, type){
		if (this.brokeragesDetail[email])
		{
			return new Promise((resolve)=>{
				resolve(this.brokeragesDetail[email][type]);
			});
		}
		else
		{
			return this._$http({
				method: 'GET',
				url: this.URL + '/brokerages/details',
				params: {
					userEmailId: email
				}
			}).then((response)=>{
				const allData = response.data.data;
				const details = {};
				details['kyc'] = this.transFormData(allData['kycDetails']);
				details['user'] = this.transFormUserData(allData['user']);
				details['profile'] = this.transFormData(allData['userProfile']);
				this.brokeragesDetail[email] = details;
				return this.brokeragesDetail[email][type];
			});
		}
	}

	transFormUserData(data)
	{
		const keyMappings =  {
		    "userId": {description: "Email Address", disabled: true},
		    "userFname": {description: "First Name", disabled: false},
		    "userLname": {description: "Last Name", disabled: false},
		    "userPhone": {description: "Phone Number", disabled: false},
		}

		return Object.keys(data).map((key)=>{
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
				this._userDetails = this.transFormUserData(data);
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

	updateKYCFields(answerList){
		return this._$http({
			method: 'POST',
			url: this.URL + '/kyckuseranswer/updatekyc/action',
			data: {"kycUserAnswerList": answerList}
		}).then((s)=>{
			this._kycDetails = angular.copy(this.kycDetails);
			return s;
		}).catch((e)=>console.log(e))
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
		else
		{
			const answers = this.kycDetails.map((field)=>{
				const answer = {
			      "answerDesc": field.selectedValue ? field.selectedValue.answerDescription:"",
			      "answerId": field.selectedValue ? field.selectedValue.answerId:0,
			      "answerText": field.answerText,
			      "questionDesc": field.questionDesc,
			      "questionId": field.questionId
			    };
			    if (field.validationType === 'DATE')
				{
					answer.answerText = this.moment(field.answerText).format('DD-MM-YYYY');
				}
				else
				{
					answer.answerText = "" + answer.answerText;
				}
				return answer;
			});
			return this.updateKYCFields(answers);
		}
	}


	updateUserDetails(details){
		return this._$http({
			method: 'POST',
			url: this.URL + '/user/updateusrdetails/action',
			data: details
		}).then((s)=>{
			this._userDetails = angular.copy(this.userDetails);
			return s;
		});
	}

	updateProfileFields(answerList){
		return this._$http({
			method: 'POST',
			url: this.URL + '/userprofile/update/action',
			data: {"userDetailAnswerList": answerList}
		}).then((s)=>{
			this._profileDetails = angular.copy(this.profileDetails);
			const userData = {};
			this.userDetails
				.filter(x=>!x.disabled)
				.forEach((detail)=>{
					userData[detail.key] = detail.value;
				});
			return this.updateUserDetails(userData);
		}).catch((e)=>console.log(e))
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
			const answers = this.profileDetails.map((field)=>{
				const answer = {
			      "answerDesc": field.selectedValue ? field.selectedValue.answerDescription:"",
			      "answerId": field.selectedValue ? field.selectedValue.answerId:0,
			      "answerText": field.answerText,
			      "questionDesc": field.questionDesc,
			      "questionId": field.questionId
			    };
			    if (field.validationType === 'DATE')
				{
					answer.answerText = this.moment(field.answerText).format('DD-MM-YYYY');
				}
				else
				{
					answer.answerText = answer.answerText ? "" + answer.answerText : "";
				}
				return answer;
			});
			console.log(answers);
			return this.updateProfileFields(answers);
		}
	}

}

export default UserService;