'use strict';

import templateUrl from './signup.html';
import controller from './signup.controller';

function routeConfig($stateProvider) {
	'ngInject';

	$stateProvider
	.state('access.signup', {
		url: 'signup',
		templateUrl,
		controller
	});
}

export default routeConfig;
