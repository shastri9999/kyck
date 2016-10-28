'use strict';

import route from './access.route';

const AccessModule = angular.module('access-module', [
	'ui.router'
	]);

AccessModule
.config(route);

export default AccessModule;