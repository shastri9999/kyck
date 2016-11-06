'use strict';

import templateUrl from './brokerage.html';
import controller from './brokerage.controller';
import brokerageResource from './brokerage.resource';

function routeConfig($stateProvider) {
	'ngInject';

	$stateProvider
	.state('main.brokerage', {
		url: '/brokerage',
		templateUrl,
		controller,
		controllerAs: 'vm',
		breadCrumb: 'Brokerage'
	});
}

export default routeConfig;
