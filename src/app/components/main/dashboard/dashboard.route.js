'use strict';

import templateUrl from './dashboard.html';
import controller from './dashboard.controller';

function routeConfig($stateProvider) {
	'ngInject';

	$stateProvider
	.state('main.dashboard', {
		url: '/dashboard',
		templateUrl,
		controller
	});
}

export default routeConfig;
