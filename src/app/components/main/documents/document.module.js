'use strict';

import route from './document.route';
import documentDirective from './document.directive';

const documentModule = angular.module('document-module', [
	'ui.router',
	'navigation-module'
	]);

documentModule
.config(route);

documentModule
.directive('documentPane', documentDirective);

export default documentModule;