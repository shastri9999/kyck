'use strict';

function routeConfig($urlRouterProvider, $stateProvider) {
	'ngInject';
	$urlRouterProvider.otherwise('/signup');
}

export default angular
.module('index.routes', [])
.config(routeConfig);