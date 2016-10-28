'use strict';

function routeConfig($urlRouterProvider, $stateProvider) {
	'ngInject';
	$urlRouterProvider.otherwise('/signin');
}

export default angular
.module('index.routes', [])
.config(routeConfig);