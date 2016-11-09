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

	vm.save = function(){
		const name = $state.current.name;
		if (name.indexOf('profile') >= 0)
		{
			UserService.saveProfileFields().then((s)=>{
				$mdToast.showSimple("Profile Details Successfully Saved!");
			}).catch((e)=>{
				$mdToast.showSimple("Please fill all fields marked as *");
			});
		}
		else
		{
			UserService.saveKYCFields().then((s)=>{
				$mdToast.showSimple("KYC Details Successfully Saved!");
			}).catch((e)=>{
				$mdToast.showSimple("Please fill all fields marked as *");
			});
		}
	}
}

export default SettingsController;