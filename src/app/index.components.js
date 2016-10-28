'use strict';
import FooterModule from './components/footer/footer.module';
import MainModule from './components/main/main.module';

export default angular.module('index.components', [
	FooterModule.name,
	MainModule.name
	]);