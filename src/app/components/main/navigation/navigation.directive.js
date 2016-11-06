'use strict';

import templateUrl from './navigation.html';

function NavigationController($mdStepper, $mdDialog, $filter, BrokerageResource, AuthenticationService, $log, $scope) {
  'ngInject';

  var vm=this;
  $scope.ifBroker = false;
  // AuthenticationService.ifBroker();
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
