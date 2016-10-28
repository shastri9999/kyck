'use strict';

import route from './messages.route';
import messageDirective from './message.directive';

const messagesPageModule = angular.module('messages-module', [
	'ui.router',
	]);

messagesPageModule
.config(route);

messagesPageModule
.directive('messageTest', messageDirective);

export default messagesPageModule;