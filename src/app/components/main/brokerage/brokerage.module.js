'use strict';

import route from './brokerage.route';
import './brokerage.scss';
import brokerageResource from './brokerage.resource';

const brokerageModule = angular.module('brokerage-module', [
	'ui.router',
	'navigation-module',
	'chart.js',
	'mdSteppers',
	'material.components.eventCalendar',
	'angAccordion'
	]);

brokerageModule
.config(route)
.factory('BrokerageResource', brokerageResource);

export default brokerageModule;