'use strict';

import route from './dashboard.route';
import './dashboard.scss';
import './dashboard.responsive.scss';
import dashboardResource from './dashboard.resource';

const dashboardModule = angular.module('dashboard-module', [
	'ui.router',
	]);

dashboardModule
.config(route)
.factory('DashboardResource', dashboardResource);

export default dashboardModule;