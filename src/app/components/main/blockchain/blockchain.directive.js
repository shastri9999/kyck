'use strict';

import templateUrl from './blockchain.html';
import controller from './blockchain.controller'

function BlockChain() {
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

export default BlockChain;
