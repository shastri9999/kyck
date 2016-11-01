'use strict';

import templateUrl from './messages.html';
import controller from './messages.controller';

function routeConfig($stateProvider) {
	'ngInject';

	$stateProvider
	.state('main.messages', {
		url: '/messages',
		templateUrl,
		controller,
		controllerAs: 'vm',
		breadCrumb: 'Messages'
	});

}

export default routeConfig;
