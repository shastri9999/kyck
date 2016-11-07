'use strict';

import route from './settings.route';
import './settings.scss';

const settingsModule = angular.module('settings-module', ['ui.router']);

settingsModule
.config(route);

export default settingsModule;