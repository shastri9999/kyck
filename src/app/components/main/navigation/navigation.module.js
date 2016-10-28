'use strict';

import NavigationDirective from './navigation.directive';
import './navigation.scss';

const NaviagtionModule = angular.module('navigation-module', []);

NaviagtionModule
  .directive('navigation', NavigationDirective);

export default NaviagtionModule;
