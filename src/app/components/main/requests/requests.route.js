'use strict';

import templateUrl from './requests.html';
import controller from './requests.controller';
import requestsResource from './requests.resource';

function routeConfig($stateProvider) {
	'ngInject';

	$stateProvider
	.state('main.requests', {
		url: '/requests',
		templateUrl,
		controller,
		controllerAs: 'vm',
		breadCrumb: 'Requests'
	});
}

export default routeConfig;
