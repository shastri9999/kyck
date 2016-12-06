'use strict';

function SettingsController($scope,$state, UserService, AuthenticationService, $mdToast) {
	'ngInject';
	
	const vm = this;
	vm.isBroker = AuthenticationService.isBroker();
	
	$scope.state = $state;
	$scope.$watch('state.current', function(state){
		if(state.name === 'main.settings'){
			$state.go('main.settings.profile');
		}
	});

	vm.cancel = function(){
		const name = $state.current.name;
		if (name.indexOf('profile') >= 0)
		{
			UserService.clearProfileFields();
			UserService.clearUserFields();

		}
		else
		{
			UserService.clearKYCFields();
		}
	}

	vm.save = function(){
		const name = $state.current.name;
		this.mainLoading = true;
		if (name.indexOf('profile') >= 0)
		{
			this.mainLoadingMessage = 'Saving Profile Details... Please wait.';
			UserService.saveProfileFields().then((s)=>{
				this.mainLoading = false;
				$mdToast.showSimple("Profile Details Successfully Saved!");
			}).catch((e)=>{
				this.mainLoading = false;
				$mdToast.showSimple("Please fill all fields marked as *");
			});
		}
		else if (name.indexOf('kyc') >= 0)
		{
			this.mainLoadingMessage = 'Saving KYC Details... Please wait.';
			UserService.saveKYCFields().then((s)=>{
				this.mainLoading = false;
				$mdToast.showSimple("KYC Details Successfully Saved!");
			}).catch((e)=>{
				this.mainLoading = false;
				$mdToast.showSimple("Please fill all fields marked as *");
			});
		}
		else if (name.indexOf('changepassword') >= 0)
		{
			const details = UserService.getChangePasswordDetails();
			let valid = true;
			
			if (details.userPassword.length == 0)
			{
				valid = false;
				details.error = 'Password cannot be empty';
			}
			else if(details.newPassword.length > 15 || details.newPassword.length < 8)
			{
				details.error = 'New Password must contain 8-15 characters';
				valid = false;
			}
			else if(details.newPassword != details.confirmPassword)
			{
				details.error = 'Passwords donot match.';
				valid = false;
			}

			if (!valid)
			{
				return;
			}
			details.error = '';
			this.mainLoadingMessage = 'Changing Password... Please wait.';
			this.mainLoading = true;
			UserService.changePassword().then((data)=>{
				UserService.resetChangePasswordDetails();
				this.mainLoading = false;
				const response = data.data;
				if(!response.data && response.Message)
				{
					details.error = response.Message;
				}
				else
				{
					$mdToast.showSimple("Password Successfully changed!");
					details.error = '';
				}
			}).catch((e)=>{
				UserService.resetChangePasswordDetails();
				this.mainLoading = false;
				details.error = e.data.message;				
			});
		}
	}
}

export default SettingsController;