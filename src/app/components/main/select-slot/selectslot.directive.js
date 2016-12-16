'use strict';

import templateUrl from './selectslot.html';
import controller from './selectslot.controller'

function SelectSlotForm() {
	'ngInject';

  let directive = {
    restrict: 'E',
    scope: {
    	selectedPartners: '=',
      timeslotSelected: '='
    },
    templateUrl,
    controller,
    controllerAs: 'vm',
    bindToController: true,
  };
  
  return directive;
}

export default SelectSlotForm;
