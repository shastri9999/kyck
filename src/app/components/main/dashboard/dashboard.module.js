'use strict';

import route from './dashboard.route';
import './dashboard.scss';

const dashboardModule = angular.module('dashboard-module', [
	'ui.router',
	]);

dashboardModule
.config(route);

export default dashboardModule;