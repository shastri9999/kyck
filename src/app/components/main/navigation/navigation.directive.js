'use strict';

import templateUrl from './navigation.html';

function NavigationController($mdStepper, $mdDialog, $filter, BrokerageResource, $log, $scope, $state, MessageService, AuthenticationService) {
  'ngInject';

  var vm=this;
  $scope.isBroker = AuthenticationService.isBroker();
  $scope.bgurl = AuthenticationService.getBGURL();
  $scope.isIA = AuthenticationService.isIA();

  $scope.signOut = function() {
    AuthenticationService.logout().then(()=>{
      MessageService.refresh();
      $state.go('access.signin');
    });
  }
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
