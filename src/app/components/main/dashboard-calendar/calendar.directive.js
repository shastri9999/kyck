'use strict';

import templateUrl from './calendar.html';
import controller from './calendar.controller'

function CalendarComponent() {
	'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl,
    controller,
    bindToController: true,
  };

  return directive;
}

export default CalendarComponent;
