'use strict';

import route from './document.route';
import documentDirective from './document.directive';
import documentResource from './document.resource';

const documentModule = angular.module('document-module', [
	'ui.router',
	'navigation-module'
	]);

documentModule
.config(route);

documentModule
.directive('documentPane', documentDirective)
.factory('DocumentResource', documentResource);

export default documentModule;