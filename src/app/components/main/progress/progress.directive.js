'use strict';

import templateUrl from './progress.html';
import controller from './progress.controller'

function ProgressComponent() {
	'ngInject';

  let directive = {
    restrict: 'E',
    scope: {
    	isVertical:'=',
      chartId: '='
    },
    templateUrl,
    controller,
    controllerAs: 'vm',
    bindToController: true,
  };
  
  return directive;
}

export default ProgressComponent;
