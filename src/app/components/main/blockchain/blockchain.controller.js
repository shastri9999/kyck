'use strict';


class BlockChainController{
	constructor($http, $scope, $interval, $rootScope, $timeout) {
		'ngInject';
		this.$http = $http;
		this.$rootScope = $rootScope;
		this.expanded = false;
		this.currentBlocks = [];
		this.populateBlocks(true);
		this.timer = $interval(this.populateBlocks.bind(this), 15000);
		$scope.$on('$destroy', ()=>{
			$interval.cancel(this.timer);
		});
		this.$timeout = $timeout;
	}
	
	populateBlocks(updateStartFrom)
	{
		this.$http({
			'method':'GET',
			url: '/kyck-rest/blockchain/blocks',
		}).then((s)=>{
			const newTotalBlocks =  +s.data.data.height;
			let totalBlocks = this.currentBlocks.length;

			if((newTotalBlocks - totalBlocks) > 1)
			{
				this.startFrom = Math.max(0, newTotalBlocks-10);
			}

			for(let i=totalBlocks; i < newTotalBlocks; ++i)
			{
				this.currentBlocks.push({
					number: i,
				});
			}

			if (newTotalBlocks > totalBlocks)
			{
				this.$timeout(()=>{this.startFrom = Math.max(0, newTotalBlocks-10);}, 5000);
			}
		}).catch((error)=>{
			//this.$rootScope.$broadcast('logout');
		})
	}

	toggle()
	{
		this.expanded = !this.expanded;
		if (this.expanded)
			this.populateBlocks();
	}

	fetchInfo(number)
	{
		const block = this.currentBlocks[number];

		const blockElement = document.querySelector('#blockchain-'+number);
		const blockInfoElement = document.querySelector('#blockinfo-'+number);
		blockInfoElement.style.left = (blockElement.offsetLeft - 25) + "px";

		if (!block.fetched)
		{
			block.fetched = true;
			this.$http({
				'method':'GET',
				url: '/kyck-rest/blockchain/block',
				params: {blockId: number}
			}).then((s)=>{
				const transaction = s.data.data.firstTransaction;
				transaction.className = "color-" + transaction.type;
				this.currentBlocks[number] = {
					...block,
					...transaction
				}
			}).catch((s)=>{
				block.fetched = false;
			});
		}
	}

}

export default BlockChainController;