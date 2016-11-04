'use strict';

import templateUrl from './toolbar.html';
import controller from './toolbar.controller';

function ToolbarComponent() {
	'ngInject';

  const directive = {
    restrict: 'E',
    templateUrl,
    controller,
    controllerAs: 'vm',
    bindToController: true
  };

  return directive;
}

export default ToolbarComponent;
