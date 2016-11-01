'use strict';

import templateUrl from './brokerage.html';
import controller from './brokerage.controller';

function routeConfig($stateProvider) {
	'ngInject';

	$stateProvider
	.state('main.brokerage', {
		url: '/brokerage',
		templateUrl,
		controller,
		breadCrumb: 'Brokerage'
	});
}

export default routeConfig;
