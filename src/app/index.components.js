'use strict';
import AccessModule from './components/access/access.module';
import MainModule from './components/main/main.module';

export default angular.module('index.components', [
	MainModule.name,
	AccessModule.name,
]);