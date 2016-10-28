'use strict';

import SignUpModule from './signup/signup.module';
import SignInModule from './signin/signin.module';
import ForgotPasswordModule from './forgot-password/forgot-password.module';
import ChangePasswordModule from './change-password/change-password.module';
import route from './access.route';

const AccessModule = angular.module('access-module', [
	'ui.router',
	 SignUpModule.name,
	 SignInModule.name,
	 ForgotPasswordModule.name,
	 ChangePasswordModule.name
	]);

AccessModule.config(route);

export default AccessModule;