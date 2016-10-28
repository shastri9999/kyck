'use strict';

import route from './signin.route';

const SignInModule = angular.module('signin-module', [
	'ui.router'
	]);

SignInModule.config(route);

export default SignInModule;