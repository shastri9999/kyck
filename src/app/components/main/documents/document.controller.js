'use strict';

function DocumentController($rootScope, $state, DocumentResource) {
	'ngInject';
	var vm = this;

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

	vm.replace = function(document){
		document.replaceAction = true;
	}


// DocumentResource.metadata({documentType: document.documentType}, function(response){
		// 	var name = response.data["documentName"];
		// 	var mimeType = response.data["mimeType"];
		// 	$log.debug(name);
		// 	var file = DocumentResource.download({documentId: name}, function(response){
		// 		$log.debug("Download called");
		// 		var blob = new Blob([(response)], {type: mimeType});
		// 		blob = URL.createObjectURL(blob);
		// 		$state.go('main.document.preview', {picFile: blob});
		// 	})
		// });
	vm.preview = function(document){
		
		$rootScope.showDocumentPreview();
	}

}

export default DocumentController;