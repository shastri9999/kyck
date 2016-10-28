'use strict';

import templateUrl from './footer.html';

function footerComponent($log) {
	'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl,
    controller: FooterController,
    controllerAs: 'vm',
    bindToController: true
  };

  return directive;

  function FooterController () {
	  $log.debug('Hello from footer controller!');
  }

}

export default footerComponent;
