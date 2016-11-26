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
			field.actualType = field.questionType;
			if (!field.answerText)
			{
				field.answerText = "";
			}
			
			if (field.validationType != 'NUMBER' && field.validationType != 'TEXT')
			{
				field.actualType = field.validationType;
			}

			
			field.actualType !== 'RADIO' && field.answersList && field.answersList.forEach((answer)=>{
				answer.answerId = +answer.answerId || 0;
				if (answer.answerId == field.answerId)
				{
					field.selectedValue = answer;
				}
			});

			if (field.actualType === 'PHONE' || field.actualType === 'CURRENCY')
			{
				const  parts = field.answerText.split('~');
				field.prefix = "";
				if (parts.length == 2)
				{
					field.prefix = parts[0];
					field.answerText = parts[1];
				}
			}


			if(!field.answerText)
				return field;

			field.displayAnswerText = field.answerText;
			if (field.prefix )
			{
				field.displayAnswerText = field.prefix + (field.actualType == "CURRENCY" ? " ": "-") + field.answerText;
			}
			
			if (field.actualType === 'DATE')
			{
				field.answerText = this.moment(field.answerText, 'DD-MM-YYYY').toDate();
			}

			if (field.validationType === 'NUMBER')
			{
				field.answerText = +field.answerText.replace(/[^0-9.]*/g,"");
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
					value: data[key].replace("~","-")
				}
			}
			return null;
		}).filter(x=>!!x);
	}

	getUserFields(){
		if (this.userFetched)
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
		let requiredFilled = true;
		this.kycDetails.forEach((field)=>{
			field.error = '';
			if (field.requireField=="REQUIRED" && ["TEXT", "NUMBER"].indexOf(field.validationType)>=0)
			{
				if (!field.answerText)
				{
					field.error = 'This field is required.'
				}
				requiredFilled = requiredFilled && !!field.answerText;
			}
			else if(field.requireField=="REQUIRED")
			{
				if (!field.selectedValue.answerId)
				{
					field.error = 'This field is required.'
				}
				requiredFilled = requiredFilled && field.selectedValue.answerId;
			}
			if (field.answerText && field.validationType === "NUMBER")
			{
				const numberTest = /^\d+(\.\d{1,2})?$/;
				if (!numberTest.test(field.answerText))
				{
					field.error = 'This should be a valid number';
					requiredFilled = false;
				}
			}

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
			      "answerText": field.answerText,
			      "questionDesc": field.questionDesc,
			      "questionId": field.questionId
			    };
			    
			    if (field.selectedValue)
			    {
			      answer.answerDesc = field.selectedValue.answerDescription;
			      answer.answerId = field.selectedValue.answerId;
			    }
			    else if (field.answersList.length)
			    {
			      answer.answerId = field.answerId;
			      const answerDescription = field.answersList.filter((al)=>{return al.answerId == answer.answerId;});
			      if (answerDescription.length)
			      {
				      answer.answerDesc = answerDescription[0].answerDescription;
			      }
			      else
			      {
			      	answer.answerDesc = "";
			      }
			    }
			    else
			    {
			      answer.answerDesc = "";
			      answer.answerId = 0;
			    }

			    if (field.actualType === 'DATE')
				{
					answer.answerText = this.moment(field.answerText).format('DD-MM-YYYY');
				}
				else if(field.actualType === 'CURRENCY' || field.actualType === 'PHONE'){
					answer.answerText = field.prefix + "~" + answer.answerText;
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
					if (detail.key == 'userPhone')
					{
						userData[detail.key] = detail.prefix + "~" + detail.value;
					}
				});
			return this.updateUserDetails(userData);
		}).catch((e)=>console.log(e))
	}

	saveProfileFields(){
		let userDetailsFilled = true;
		this.userDetails.forEach((field)=>{
			if (!field.value)
			{
				field.error = 'This field is required.'
			}
			else
			{
				field.error = '';
			}
			userDetailsFilled = userDetailsFilled && !!field.value;
		});

		let requiredFilled = true;
		this.profileDetails.forEach((field)=>{
	
			field.error = '';
			if (field.requireField=="REQUIRED" && ["TEXT", "NUMBER", "CURRENCY"].indexOf(field.questionType)>=0)
			{
				if (!field.answerText)
				{
					field.error = 'This field is required.'
				}
				requiredFilled = requiredFilled && !!field.answerText;
			}
			else if(field.requireField=="REQUIRED")
			{
				if (!field.selectedValue.answerId)
				{
					field.error = 'This field is required.'
				}
				requiredFilled = requiredFilled && field.selectedValue.answerId;
			}
			if (field.answerText && field.questionType === "NUMBER")
			{
				const numberTest = /^\d+(\.\d{1,2})?$/;
				if (!numberTest.test(field.answerText))
				{
					field.error = 'This should be a valid number';
					requiredFilled = false;
				}
			}

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
			      "answerText": field.answerText,
			      "questionDesc": field.questionDesc,
			      "questionId": field.questionId
			    };
			    if (field.selectedValue)
			    {
			      answer.answerDesc = field.selectedValue.answerDescription;
			      answer.answerId = field.selectedValue.answerId;
			    }
			    else if (field.answersList.length)
			    {
			      answer.answerId = field.answerId;
			      const answerDescription = field.answersList.filter((al)=>{return al.answerId == answer.answerId;});
			      if (answerDescription.length)
			      {
				      answer.answerDesc = answerDescription[0].answerDescription;
			      }
			      else
			      {
			      	answer.answerDesc = "";
			      }
			    }
			    else
			    {
			      answer.answerDesc = "";
			      answer.answerId = 0;
			    }

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
			return this.updateProfileFields(answers);
		}
	}

}

export default UserService;