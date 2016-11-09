'use strict';

import route from './help.route';
import './help.scss';

const helpModule = angular.module('help-module', [
	'ui.router',
	'navigation-module'
	]);

helpModule
.config(route);

export default helpModule;