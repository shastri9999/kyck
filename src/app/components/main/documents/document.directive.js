'use strict';

import documentHtml from './document.html';
import './document.scss';

function documentComponent($log) {
	'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: documentHtml,
    controller: DocumentController,
    controllerAs: 'vm',
    bindToController: true
  };

  return directive;

  function DocumentController () {
	  $log.debug('Hello from Document controller!');
  }

}

export default documentComponent;
