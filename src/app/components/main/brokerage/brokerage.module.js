'use strict';

import route from './brokerage.route';

const brokerageModule = angular.module('brokerage-module', [
	'ui.router',
	'navigation-module'
	]);

brokerageModule
.config(route);

export default brokerageModule;