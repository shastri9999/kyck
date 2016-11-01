'use strict';

import templateUrl from './documents.html';
import controller from './document.controller';

function routeConfig($stateProvider) {
	'ngInject';

	$stateProvider
	.state('main.document', {
		url: '/document',
		templateUrl,
		controller,
		breadCrumb: 'Documents'
	});
}

export default routeConfig;
