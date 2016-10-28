'use strict';

import templateUrl from './main.html';
import controller from './main.controller';

function routeConfig($stateProvider) {
  'ngInject';

  $stateProvider
    .state('main', {
      url: '/',
      templateUrl,
      controller
    });

}

export default routeConfig;
