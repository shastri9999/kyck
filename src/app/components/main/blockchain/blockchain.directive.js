'use strict';

import templateUrl from './blockchain.html';
import controller from './blockchain.controller'

function BlockChain() {
	'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl,
    controller,
    controllerAs: 'vm',
    bindToController: true,
  };
  
  return directive;
}

export default BlockChain;
