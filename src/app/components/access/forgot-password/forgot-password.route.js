'use strict';

import templateUrl from './forgot-password.html';
import controller from './forgot-password.controller';

function routeConfig($stateProvider) {
	'ngInject';

	$stateProvider
	.state('access.forgot-password', {
		url: 'forgot-password',
		templateUrl,
		controller
	});
}

export default routeConfig;
