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
				$mdToast.showSimpleMessage("Profile Details Successfully Saved!");
			}).catch((e)=>console.log(e));
		}
		else
		{
			UserService.saveKYCFields().then((s)=>{
				$mdToast.showSimpleMessage("KYC Details Successfully Saved!");
			}).catch((e)=>console.log(e));
		}
	}
}

export default SettingsController;