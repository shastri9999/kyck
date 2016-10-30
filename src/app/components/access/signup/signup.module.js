'use strict';

import route from './signup.route';
import './signup.scss';

const SignUpModule = angular.module('signup-module', [
	'ui.router'
	]);

SignUpModule.config(route);

export default SignUpModule;