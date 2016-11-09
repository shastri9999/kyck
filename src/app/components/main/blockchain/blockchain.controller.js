'use strict';


class BlockChainController{
	constructor($http, $interval, moment) {
		'ngInject';
		this.$http = $http;
		this.$interval = $interval;
		this.expanded = false;
		this.populateBlocks(true);
		
	}
	
	populateBlocks(updateStartFrom)
	{
		this.$http({
			'method':'GET',
			url: '/kyck-rest/blockchain/blocks',
		}).then((s)=>{
			this.totalBlocks = +s.data.data.height;
			this.currentBlocks = [];
			if (updateStartFrom)
				this.startFrom = Math.max(0, this.totalBlocks-12);
			for(let i=this.currentBlocks.length; i < this.totalBlocks; ++i)
			{
				this.currentBlocks.push({
					number: i+1,
				});
			}
		})
	}

	toggle()
	{
		this.expanded = !this.expanded;
	}

	fetchInfo(number)
	{
		const block = this.currentBlocks[number-1];

		if (!block.fetched)
		{
			block.fetched = true;
			this.$http({
				'method':'GET',
				url: '/kyck-rest/blockchain/block',
				params: {blockId: number-1}
			}).then((s)=>{
				console.log(s.data.firstTransaction);
			});
		}
	}

}

export default BlockChainController;