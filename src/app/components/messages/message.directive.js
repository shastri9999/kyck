'use strict';

import messageHtml from './message.html';
import './message.scss';

function messageComponent($log) {
	'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: messageHtml,
    controller: MessageController,
    bindToController: true,
    message: '='
  };

  return directive;

  function MessageController () {
	  $log.debug('Hello from Message controller!');
    //$log.debug($scope.message);
  }

}

export default messageComponent;
