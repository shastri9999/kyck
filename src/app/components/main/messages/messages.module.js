'use strict';

import route from './messages.route';
import messageResource from './messages.resource';
import './messages.scss';
import './messages.responsive.scss';

const messagesModule = angular.module('messages-module', [
	'ui.router'
	]);

messagesModule
.config(route);

export default messagesModule;