'use strict';

import templateUrl from './calendar.html';
import controller from './calendar.controller';

function routeConfig($stateProvider) {
	'ngInject';

	$stateProvider
	.state('main.calendar', {
		url: '/calendar',
		templateUrl,
		controller
	});
}

export default routeConfig;
