'use strict';

import messageHtml from './message.html';
import './message.scss';

function messageComponent($log) {
	'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: messageHtml,
    controller: MessageController,
    controllerAs: 'vm',
    bindToController: true
  };

  return directive;

  function MessageController () {
	  $log.debug('Hello from Message controller!');
  }

}

export default messageComponent;
