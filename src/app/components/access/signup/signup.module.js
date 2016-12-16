'use strict';

import route from './signup.route';
import './signup.scss';
import './signup.responsive.scss';

const SignUpModule = angular.module('signup-module', [
	'ui.router'
	]);

SignUpModule.config(route);

export default SignUpModule;