'use strict';

import route from './signup.route';

const SignUpModule = angular.module('signup-module', [
	'ui.router'
	]);

SignUpModule.config(route);

export default SignUpModule;