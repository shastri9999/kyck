'use strict';

import DashboardModule from './dashboard/dashboard.module';
import CalendarModule from './calendar/calendar.module';
import BrokerageModule from './brokerage/brokerage.module';
import RequestsModule from './requests/requests.module';
import HelpModule from './help/help.module';
import NavigationModule from './navigation/navigation.module';
import ToolbarModule from './toolbar/toolbar.module';
import DocumentModule from './documents/document.module';
import ProgressModule from './progress/progress.module';
import DashboardCalendarModule from './dashboard-calendar/calendar.module';
import route from './main.route';
import './main.scss';

const mainModule = angular.module('main-module', [
	'ui.router',
	NavigationModule.name,
	DashboardModule.name,
	CalendarModule.name,
	RequestsModule.name,
	HelpModule.name,
	BrokerageModule.name,
	ToolbarModule.name,
	DocumentModule.name,
	ProgressModule.name,
	DashboardCalendarModule.name
	]);

mainModule
.config(route);

export default mainModule;