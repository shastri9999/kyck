import config from './index.config';
import Components from './index.components';
import Routes from './index.routes';
import Common from './common/common.module'

export default angular.module('kyck', [
	'ui.router',
	'ngAnimate', 
	'ngCookies', 
	'ngSanitize', 
	'ngMessages', 
	'ngAria', 
	'oc.lazyLoad',
	'ngMaterial',
	'ngResource',
	'ngFileUpload',
	'uiCropper',
	'angularMoment',
	Common.name,
	Components.name,
	Routes.name
	]
	)
.config(config)
.run(function($rootScope, $location, AuthenticationService){
	'ngInject';
	$rootScope.$on('$stateChangeStart', function (event, next, toParams) {
		const loggedIn = AuthenticationService.getLoggedInUser();
		const isAccessPage = next.name.indexOf("access.")==0;
		if (!loggedIn && !isAccessPage) {
			$location.url('/signin');              	
		}

		/* Todo: Move all this to service */
		$rootScope.breadCrumb = next.breadCrumb;
		$rootScope.sideNavCollapsed = false;
		$rootScope.messageView = {
			activeMessage: null,
			composing: false
		}
	});
});
