'use strict';

import DashboardModule from './dashboard/dashboard.module';
import CalendarModule from './calendar/calendar.module';
import BrokerageModule from './brokerage/brokerage.module';
import HelpModule from './help/help.module';
import NavigationModule from './navigation/navigation.module';
import route from './main.route';

const mainModule = angular.module('main-module', [
	'ui.router',
	NavigationModule.name,
	DashboardModule.name,
	CalendarModule.name,
	HelpModule.name,
	BrokerageModule.name,
	]);

mainModule
.config(route);

export default mainModule;