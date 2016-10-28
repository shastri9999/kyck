'use strict';

import route from './dashboard.route';

const dashboardModule = angular.module('dashboard-module', [
	'ui.router'
	]);

dashboardModule
.config(route);

export default dashboardModule;