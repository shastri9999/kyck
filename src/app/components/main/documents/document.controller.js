'use strict';

function DocumentController($rootScope, $state, DocumentResource, $http) {
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


	vm.preview = function(document){
		$rootScope.canEnableOCR = true;
		$rootScope.showDocumentPreview();
		DocumentResource.metadata({documentType: document.documentType}, function(response){
			const documentData = response.data;
			let document = documentData;
			$rootScope.viewingDocument = document;
			$rootScope.viewingDocument.OCR = null;
			DocumentResource.ocrdata({documentCategory: document.documentType}, function(response){
				$rootScope.viewingDocument.OCR = response.data;
			});
			$http({
				method: 'GET',
				url: '/kyck-rest/document/download/string64',
				params: {documentId: documentData.documentName},
				transformResponse: [function (data) {
				      return data;
				  }]
			}).then((data)=>{
				let URL = 'data:' + documentData.mimeType + ';base64,' + data.data;
				$rootScope.showDocumentPreview(URL);
			})
		});
	}

}

export default DocumentController;