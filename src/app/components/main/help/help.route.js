'use strict';

import templateUrl from './help.html';
import controller from './help.controller';

function routeConfig($stateProvider) {
	'ngInject';

	$stateProvider
	.state('main.help', {
		url: '/help',
		templateUrl,
		controller,
		breadCrumb: 'Help'
	});
}

export default routeConfig;
