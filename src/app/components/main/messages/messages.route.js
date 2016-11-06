'use strict';

import templateUrl from './messages.html';
import inboxTemplateUrl from './inbox.html';
import sentTemplateUrl from './sent.html';

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
	})
	.state('main.messages.inbox', {
		url: '/inbox',
		templateUrl: inboxTemplateUrl,
		controller: function(){},
		controllerAs: 'vm',
		breadCrumb: 'Messages'
	})
	.state('main.messages.sent', {
		url: '/sent',
		templateUrl: sentTemplateUrl,
		controller: function(){},
		controllerAs: 'vm',
		breadCrumb: 'Messages'
	});

}

export default routeConfig;
