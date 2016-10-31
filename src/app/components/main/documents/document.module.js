'use strict';

import route from './document.route';

const documentModule = angular.module('document-module', [
	'ui.router',
	'navigation-module'
	]);

documentModule
.config(route);

export default documentModule;