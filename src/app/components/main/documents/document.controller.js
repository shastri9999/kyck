'use strict';

function DocumentController($log, DocumentResource) {
	'ngInject';
	var vm = this;
	/*
	vm.documents = [
		{
			title: 'Income Tax',
			docType: 'Required',
			comment: 'Lorem ipsum dorum sit amet, consectuter',
			iconUrl: '/assets/images/1.png'
		},
		{
			title: 'NRIC or NIF',
			docType: 'Required',
			comment: 'Front and back page required',
			iconUrl: '/assets/images/2.png'
		},
		{
			title: 'Passport',
			docType: 'Required',
			comment: 'Front and back page required',
			iconUrl: '/assets/images/3.png'
		},
		{
			title: 'Address',
			docType: 'Required',
			comment: 'Lorem ipsum dorum sit amet, consectuter',
			iconUrl: '/assets/images/4.png'
		},
		{
			title: 'Salary Slip',
			docType: 'Optional',
			comment: 'Attach last 3 months salary slip',
			iconUrl: '/assets/images/5.png'
		},
		{
			title: 'Provident Fund',
			docType: 'Additional',
			comment: 'Lorem ipsum dorum sit amet, consectuter',
			iconUrl: '/assets/images/6.png'
		},
		{
			title: 'Bank Statement',
			docType: 'Required',
			comment: 'Attach last 6 months bank statement',
			iconUrl: '/assets/images/7.png'
		}
	];
	*/

	DocumentResource.categories(function(response){
			$log.debug(response);
			vm.documents = response.data;
	}, function(error){
			$log.error(error);
	});

}

export default DocumentController;