'use strict';

import templateUrl from './signin.html';
import controller from './signin.controller';

function routeConfig($stateProvider) {
	'ngInject';

	$stateProvider
	.state('access.signin', {
		url: 'signin',
		templateUrl,
		controller,
		controllerAs: 'vm'
	});
}

export default routeConfig;
