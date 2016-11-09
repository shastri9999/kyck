'use strict';

class BlockChainController {
	constructor($http, $scope, $interval){
		'ngInject';
		this.$http  = $http;
		this.$scope = $scope;
		this.$interval = $interval;
	}
}

export default BlockChainController;