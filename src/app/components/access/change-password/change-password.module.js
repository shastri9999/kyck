'use strict';

import route from './change-password.route';

const ChangePasswordModule = angular.module('change-password-module', [
	'ui.router'
	]);

ChangePasswordModule.config(route);

export default ChangePasswordModule;