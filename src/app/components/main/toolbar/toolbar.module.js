'use strict';

import ToolbarDirective from './toolbar.directive';
import './toolbar.scss';
import './toolbar.responsive.scss';

const ToolbarModule = angular.module('toolbar-module', []);

ToolbarModule
  .directive('toolbar', ToolbarDirective);

export default ToolbarModule;
