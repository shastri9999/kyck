'use strict';

import templateUrl from './main.html';
import controller from './main.controller';

function routeConfig($stateProvider) {
	'ngInject';

	$stateProvider
	.state('main', {
		url: '/app',
		templateUrl,
		controller
	});
}

export default routeConfig;
