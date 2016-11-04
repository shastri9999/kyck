'use strict';

import progressDirective from './progress.directive';
const progressModule = angular.module('progress-module', []);
progressModule.directive('progressDisplay', progressDirective);

export default progressModule;