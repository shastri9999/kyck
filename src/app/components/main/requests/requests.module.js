'use strict';

import route from './requests.route';
import './requests.scss';
import requestsResource from './requests.resource';

const requestsModule = angular.module('requests-module', [
	'ui.router',
	'navigation-module',
	'chart.js',
	'mdSteppers',
	'material.components.eventCalendar'
	]);

requestsModule
.config(route)
.factory('RequestsResource', requestsResource);

export default requestsModule;