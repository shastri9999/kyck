'use strict';

function HelpController($http) {
	'ngInject';
	$http({
		method: 'GET',
		url: '/kyck-rest/blockchain/getnric'
	}).then((s)=>{
		console.log(s.data.data);
		const data = JSON.parse(s.data.data.message.result.message);
		this.hashes = Object.keys(data).map((key)=>{
			return {
				requestId: key,
				nricId: data[key],
				hash: ''
			}
		});
	})

	this.validate = function(hash)
	{
		console.log(hash);
		$http({
			method: 'GET',
			url: '/kyck-rest/blockchain/validate',
			params: {requestId : hash.requestId,
			blockHash: hash.hash}
		}).then((s)=>{
			consol.log(s);
		})
	}
}

export default HelpController;