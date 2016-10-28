'use strict';

import SignUpModule from './signup/signup.module';
import route from './access.route';

const AccessModule = angular.module('access-module', [
	'ui.router',
	 SignUpModule.name
	]);

AccessModule.config(route);

export default AccessModule;