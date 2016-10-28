'use strict';

import route from './messages.route';

const messagesPageModule = angular.module('messages-module', [
	'ui.router',
	]);

messagesPageModule
.config(route);

export default messagesPageModule;