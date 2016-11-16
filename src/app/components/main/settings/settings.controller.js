'use strict';

function SettingsController($scope,$state, UserService, $mdToast) {
	'ngInject';
	
	const vm = this;

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
		else
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
	}
}

export default SettingsController;