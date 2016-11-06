'use strict';

import templateUrl from './progress.html';
import controller from './progress.controller'

function ProgressComponent() {
	'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl,
    controller,
    bindToController: true,
  };
  
  return directive;
}

export default ProgressComponent;
