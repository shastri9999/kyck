'use strict';

function SignInController(AuthenticationService, $state){
	'ngInject';
	return {
		'signIn': function(){
			AuthenticationService.login('user1@user.com');
			$state.go('main.dashboard');
		}
	}
}

export default SignInController;