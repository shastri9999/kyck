'use strict';

import route from './signin.route';
import './signin.scss';

const SignInModule = angular.module('signin-module', [
	'ui.router'
	]);

SignInModule.config(route);

export default SignInModule;