'use strict';

const Calendar = require('calendar-base').Calendar;

function CalendarController() {
	'ngInject';
	const calendar = new Calendar();
	console.log(calendar.getCalendar(2016, 10));
}

export default CalendarController;