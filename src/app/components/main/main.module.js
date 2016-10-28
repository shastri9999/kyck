'use strict';

import DashboardModule from './dashboard/dashboard.module';
import NavigationModule from './navigation/navigation.module';
import route from './main.route';

const mainModule = angular.module('main-module', [
	'ui.router',
	NavigationModule.name,
	DashboardModule.name
	]);

mainModule
.config(route);

export default mainModule;