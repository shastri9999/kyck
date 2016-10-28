'use strict';

import config from './index.config';
import Components from './index.components';
import Routes from './index.routes';

export default angular.module('kyck', [
	'ui.router',
  	'ngAnimate', 
	'ngCookies', 
	'ngTouch', 
	'ngSanitize', 
	'ngMessages', 
	'ngAria', 
	'oc.lazyLoad',
	'ngMaterial',
	Components.name,
	Routes.name
  ]
).config(config);