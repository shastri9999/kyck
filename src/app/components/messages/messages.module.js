'use strict';

import route from './messages.route';
import messageDirective from './message.directive';
import messageResource from './messages.resource';

const messagesPageModule = angular.module('messages-module', [
	'ui.router'
	]);

messagesPageModule
.config(route);

messagesPageModule
.directive('messageTest', messageDirective)
.factory('MessageResource', messageResource);

export default messagesPageModule;