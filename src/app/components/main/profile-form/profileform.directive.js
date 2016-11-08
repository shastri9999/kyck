'use strict';

import templateUrl from './profileform.html';
import controller from './profileform.controller'

function ProfileForm() {
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

export default ProfileForm;
