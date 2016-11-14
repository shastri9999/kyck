'use strict';

import templateUrl from './navigation.html';

function NavigationController($mdStepper, $mdDialog, $filter, BrokerageResource, AuthenticationService, $log, $scope) {
  'ngInject';

  var vm=this;
  $scope.isBroker = AuthenticationService.isBroker();
  $scope.bgurl = AuthenticationService.getBGURL();
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
