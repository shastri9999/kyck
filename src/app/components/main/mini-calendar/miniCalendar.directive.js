'use strict';

import templateUrl from './miniCalendar.html';
import controller from './miniCalendar.controller'

function MiniCalendar() {
	'ngInject';

  let directive = {
    restrict: 'E',
    scope: {
    	isBroker: '=',
    	userEmailId: '='
    },
    templateUrl,
    controller,
    controllerAs: 'vm',
    bindToController: true,
  };
  
  return directive;
}

export default MiniCalendar;
