'use strict';

function routeConfig($urlRouterProvider, $stateProvider, resolverProvider) {
  'ngInject';
  $urlRouterProvider.otherwise('/');
}

export default angular
  .module('index.routes', [])
  .config(routeConfig);

