'use strict';

import templateUrl from './navigation.html';

function NavigationComponent() {
	'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl,
    controller,
    controllerAs: 'vm',
    bindToController: true
  };

  return directive;

  function controller() {

  }

}

export default NavigationComponent;
