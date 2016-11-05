'use strict';

import calendarDirective from './calendar.directive';
const calendarModule = angular.module('dashboard-calendar-module', []);
calendarModule.directive('calendarDisplay', calendarDirective);

export default calendarModule;