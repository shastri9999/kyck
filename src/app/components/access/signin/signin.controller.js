'use strict';

class SignInController {
	constructor(AuthenticationService, $state){
		'ngInject';

		this._AuthenticationService = AuthenticationService;
		this._$state = $state;
	}

	signIn(){
		this._AuthenticationService.login('user1@user.com');
		this._$state.go('main.dashboard');
	}

}

export default SignInController;