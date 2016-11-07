'use strict';

import templateUrl from './kycform.html';
import controller from './kycform.controller'

function KYCForm() {
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

export default KYCForm;
