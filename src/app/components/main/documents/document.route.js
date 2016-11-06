'use strict';

import templateUrl from './documents.html';
import cropUrl from './document_crop.html';
import controller from './document.controller';

function routeConfig($stateProvider) {
	'ngInject';

	$stateProvider
	.state('main.document', {
		url: '/document',
		templateUrl,
		controller,
		controllerAs: 'vm',
		breadCrumb: 'Documents'
	})
	.state('main.document.preview', {
		url: '/preview',
		params: {
			picFile: null
		},
		templateUrl: cropUrl,
		onEnter: function ($mdDialog, $mdMedia, $state, $stateParams) {
			'ngInject';
            $mdDialog.show({
                controller: function($scope, $log, picFile){
                	'ngInject';
                	$log.debug("Inside preview controller");
                	var vm = this;
                	vm.picFile = picFile;
                	$log.debug(vm.picFile);
                },
                controllerAs: 'vm',
                templateUrl: cropUrl,
                clickOutsideToClose: true,
                locals: {
                    picFile: $stateParams.picFile
                }
            }).finally(function () {
                $state.go('^');
            });
        }
	});
}

export default routeConfig;
