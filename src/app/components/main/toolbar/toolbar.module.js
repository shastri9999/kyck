'use strict';

import ToolbarDirective from './toolbar.directive';
import './toolbar.scss';

const ToolbarModule = angular.module('toolbar-module', []);

ToolbarModule
  .directive('toolbar', ToolbarDirective);

export default ToolbarModule;
