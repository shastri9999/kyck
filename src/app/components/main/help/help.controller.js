'use strict';

function HelpController($http) {
	'ngInject';
	$http({
		method: 'GET',
		url: '/kyck-rest/blockchain/getnric'
	}).then((s)=>{
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
		// $http({
		// 	method: 'POST',
		// 	url: '/kyck-rest/blockchain/getnric',
		// 	data: {}
		// }).then((s)=>{

		// })
	}
}

export default HelpController;