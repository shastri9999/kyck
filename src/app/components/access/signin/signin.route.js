'use strict';

import templateUrl from './signin.html';
import controller from './signin.controller';

function routeConfig($stateProvider) {
	'ngInject';

	$stateProvider
	.state('access.signin', {
		url: 'signin',
		templateUrl,
		controller,
		controllerAs: 'vm',
		resolve: {
			currentUser: function(AuthenticationService) {
				'ngInject';
				return AuthenticationService.getLoggedInUser();
			},
			isIA: function(AuthenticationService) {
				'ngInject';
				return AuthenticationService.isIA();
			}
		},
		onEnter: function(currentUser, isIA, $state){
			'ngInject';
			if (isIA)
			{
				$state.go('main.help');
			}
			else if (currentUser)
			{
				$state.go('main.dashboard');
			}
		}
	});
}

export default routeConfig;
