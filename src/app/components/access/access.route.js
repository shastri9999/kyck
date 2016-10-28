'use strict';

import templateUrl from './access.html';
import controller from './access.controller';

function routeConfig($stateProvider) {
	'ngInject';

	$stateProvider
	.state('access', {
		url: '/',
		templateUrl,
		controller
	});
}

export default routeConfig;
