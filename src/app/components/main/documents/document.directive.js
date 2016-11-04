'use strict';

import documentHtml from './document.html';
import './document.scss';

function documentComponent($log) {
	'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: documentHtml,
    controller: DocumentController,
    bindToController: true,
    document: '='
  };

  return directive;

  function DocumentController ($scope) {
    'ngInject';
	  $log.debug('Hello from Document controller!');
    $scope.upload = function(file){
      $log.debug(file);
    }
  }

}

export default documentComponent;
