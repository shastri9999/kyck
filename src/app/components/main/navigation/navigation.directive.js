'use strict';

import templateUrl from './navigation.html';

function NavigationController($mdStepper, $mdDialog, $filter, BrokerageResource, AuthenticationService, $log) {
  'ngInject';

  var vm=this;
  vm.ifBroker = true;
  // AuthenticationService.ifBroker();
  console.log("HEY", vm.ifBroker);
}

function NavigationComponent() {
	'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl,
    controller: NavigationController,
    controllerAs: 'vm',
    bindToController: true
  };

  return directive;
}

export default NavigationComponent;
