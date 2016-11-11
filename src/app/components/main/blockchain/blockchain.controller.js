'use strict';


class BlockChainController{
	constructor($http, $scope, $interval) {
		'ngInject';
		this.$http = $http;
		this.expanded = false;
		this.currentBlocks = [];
		this.populateBlocks(true);
		this.timer = $interval(this.populateBlocks.bind(this), 15000);
		$scope.$on('$destroy', ()=>{
			$interval.cancel(this.timer);
		});
	}
	
	populateBlocks(updateStartFrom)
	{
		this.$http({
			'method':'GET',
			url: '/kyck-rest/blockchain/blocks',
		}).then((s)=>{
			this.totalBlocks = +s.data.data.height;
			if (updateStartFrom)
				this.startFrom = Math.max(0, this.totalBlocks-12);
			for(let i=this.currentBlocks.length; i < this.totalBlocks; ++i)
			{
				this.currentBlocks.push({
					number: i,
				});
			}
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

		if (!block.fetched)
		{
			block.fetched = true;
			this.$http({
				'method':'GET',
				url: '/kyck-rest/blockchain/block',
				params: {blockId: number}
			}).then((s)=>{
				const transaction = s.data.data.firstTransaction;
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