'use strict';

import route from './forgot-password.route';
import './forgot-password.scss';
import './forgot-password.responsive.scss';

const ForgotPasswordModule = angular.module('forgot-password-module', [
	'ui.router'
	]);

ForgotPasswordModule.config(route);

export default ForgotPasswordModule;