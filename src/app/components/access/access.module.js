'use strict';

import TermScroller from './term-scroller.directive';
import SignUpModule from './signup/signup.module';
import SignInModule from './signin/signin.module';
import ForgotPasswordModule from './forgot-password/forgot-password.module';
import ChangePasswordModule from './change-password/change-password.module';
import route from './access.route';
import './access.scss';

const AccessModule = angular.module('access-module', [
	'ui.router',
	 SignUpModule.name,
	 SignInModule.name,
	 ForgotPasswordModule.name,
	 ChangePasswordModule.name
	]);

AccessModule.directive('termScroller', TermScroller);

AccessModule.config(route);

export default AccessModule;