'use strict';

import route from './calendar.route';

const calendarModule = angular.module('calendar-module', [
	'ui.router',
	'navigation-module'
	]);

calendarModule
.config(route);

export default calendarModule;