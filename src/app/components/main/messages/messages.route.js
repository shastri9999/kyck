'use strict';

import templateUrl from './messages.html';
import inboxTemplateUrl from './inbox.html';
import sentTemplateUrl from './sent.html';

import controller from './messages.controller';
import inboxController from './inbox.controller';
import sentController from './sent.controller';

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
		controller: inboxController,
		controllerAs: 'vm',
		breadCrumb: 'Messages - Inbox'
	})
	.state('main.messages.sent', {
		url: '/sent',
		templateUrl: sentTemplateUrl,
		controller: sentController,
		controllerAs: 'vm',
		breadCrumb: 'Messages - Sent'
	});

}

export default routeConfig;
