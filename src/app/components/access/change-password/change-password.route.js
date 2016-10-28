'use strict';

import templateUrl from './change-password.html';
import controller from './change-password.controller';

function routeConfig($stateProvider) {
	'ngInject';

	$stateProvider
	.state('access.change-password', {
		url: 'change-password',
		templateUrl,
		controller
	});
}

export default routeConfig;
