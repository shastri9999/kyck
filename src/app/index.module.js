'use strict';

import * as components from './index.components';
import config from './index.config';
import Components from './index.components';
import Routes from './index.routes';
import MainModule from './pages/main/main.module';

export default angular.module('kyck', [
  'ui.router',
  'ngAnimate', 
	'ngCookies', 
	'ngTouch', 
	'ngSanitize', 
	'ngMessages', 
	'ngAria', 
	'oc.lazyLoad',
  Components.name,
  Routes.name,
  MainModule.name
  ]
).config(config);