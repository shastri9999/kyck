'use strict';

function config($logProvider, $mdThemingProvider) {
	'ngInject';
	$logProvider.debugEnabled(true);
  	$mdThemingProvider.disableTheming();
}

export default config;