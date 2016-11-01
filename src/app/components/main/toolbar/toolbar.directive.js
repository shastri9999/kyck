'use strict';

import templateUrl from './toolbar.html';

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

  const controller = ($scope)=> {
    'ngInject';
  }

}

export default ToolbarComponent;
