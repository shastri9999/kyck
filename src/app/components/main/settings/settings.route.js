'use strict';

import templateUrl from './settings.html';
import userProfileTemplateUrl from './profile.html';
import changePasswordTemplateUrl from './change-password.html';
import kycTemplateUrl from './kyc.html';
import controller from './settings.controller';


function routeConfig($stateProvider) {
	'ngInject';

	$stateProvider
	.state('main.settings', {
		url: '/settings',
		templateUrl,
		controller,
		controllerAs:'vm',
		breadCrumb: 'Settings'
	}).state('main.settings.kyc', {
		url: '/kyc',
		templateUrl: kycTemplateUrl,
		controller: function(){},
		controllerAs: 'vm',
		breadCrumb: 'Settings - KYC'
	})
	.state('main.settings.profile', {
		url: '/profile',
		templateUrl: userProfileTemplateUrl,
		controller: function(){},
		controllerAs: 'vm',
		breadCrumb: 'Settings - Profile'
	})
	.state('main.settings.changepassword', {
		url: '/change-password',
		templateUrl: changePasswordTemplateUrl,
		controller: function(){},
		controllerAs: 'vm',
		breadCrumb: 'Settings - Change Password'
	})
}

export default routeConfig;
