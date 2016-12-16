'use strict';

import route from './settings.route';
import './settings.scss';
import './settings.responsive.scss';

const settingsModule = angular.module('settings-module', ['ui.router']);

settingsModule
.config(route);

export default settingsModule;