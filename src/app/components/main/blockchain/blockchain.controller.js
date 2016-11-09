'use strict';


class BlockChainController{
	constructor() {
		'ngInject';

		this.expanded = false;
		this.currentBlocks = [];
		this.totalBlocks = 20;
		this.startFrom = 15;
		this.populateBlocks();
	}
	
	populateBlocks()
	{
		for(let i=this.currentBlocks.length; i < this.totalBlocks; ++i)
		{
			this.currentBlocks.push({
				number: i+1,
			});
		}
	}

	toggle()
	{
		this.expanded = !this.expanded;
	}

	fetchInfo(number)
	{
		
	}

}

export default BlockChainController;