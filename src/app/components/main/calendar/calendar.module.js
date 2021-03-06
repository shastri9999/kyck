'use strict';

import route from './calendar.route';
import './calendar.scss';
import '../../../common/angular-material-event-calendar/dist/angular-material-event-calendar';

const calendarModule = angular.module('calendar-module', [
	'ui.router',
	'navigation-module',
	'material.components.eventCalendar'
	]);

calendarModule
.config(route);

export default calendarModule;