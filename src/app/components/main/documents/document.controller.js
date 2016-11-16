'use strict';

function DocumentsController($rootScope, $state, DocumentResource, $http) {
	'ngInject';
	var vm = this;
	$rootScope.loadingProgress = false;

	DocumentResource.categories(function(response){
			vm.documents = response.data;
			vm.documents.forEach(function(doc){
				doc.documentID = null; //Making default docId as null. Replacing it with actual value in next call
				doc.replaceAction = false;
			});
			DocumentResource.findall(function(response){
				if(response && response.data){
					response.data.forEach(function(existingDoc){
						for(var i=0; i<vm.documents.length; i++){
							if(existingDoc.documentType==vm.documents[i].documentType){
								vm.documents[i].documentID = existingDoc.documentID;
								break;
							}
						}
					});
				}
			})
	}, function(error){
	});
}

export default DocumentsController;