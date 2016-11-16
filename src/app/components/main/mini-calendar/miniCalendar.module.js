'use strict';

import directive from './miniCalendar.directive';
import './miniCalendar.scss';

const miniCalendarModule = angular.module('mini-calendar-module', ['material.components.eventCalendar']);
miniCalendarModule.directive('miniCalendar', directive);

export default miniCalendarModule;