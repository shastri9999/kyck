'use strict';

import documentHtml from './document.html';
import './document.scss';
import './document.responsive.scss';

function documentComponent() {
	'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: documentHtml,
    controller: DocumentPaneController,
    bindToController: true,
    controllerAs: 'vm',
    scope: {
      isBroker: '=',
      userId: '=',    
      document: '=',
    }
  };

  return directive;

  function DocumentPaneController ($log, $scope, $mdToast, $state, Upload, DocumentResource, $rootScope, $http) {
    'ngInject';

    const vm = this;
    $scope.document = this.document;
    $scope.isBroker = this.isBroker;
    $scope.userId = this.userId;

    vm.replace = function(document){
      document.replaceAction = true;
    }


    vm.preview = function(document){
      $rootScope.canEnableOCR = !vm.isBroker;
      $rootScope.showDocumentPreview();
      if (!vm.isBroker)
      {
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
      else
      {
          DocumentResource.brokermetadata({documentType: document.documentType, userId: vm.userId}, function(response){
          const documentData = response.data;
          let document = documentData;
          $rootScope.viewingDocument = document;
          $rootScope.viewingDocument.OCR = null;
          $http({
            method: 'GET',
            url: '/kyck-rest/document/usr/download/string64',
            params: {documentName: documentData.documentName,
              userId:vm.userId},
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


    vm.upload = function(file, document){       
      $rootScope.mainLoading = true;
      $rootScope.mainLoadingMessage = "Document is being uploaded... Please wait."

      Upload.upload({
        url: '/kyck-rest/document/upload?documentType='+document.documentType,
        data: {
          file: file
        }
      }).then(function(response){
        $log.debug(response);
        $log.debug('Success: ' + response.config.data.file.name + 'Uploaded. Response: ' + response.data);
        $rootScope.mainLoading = false;
        $mdToast.show(
          $mdToast.simple()
          .textContent('File Uploaded Successfully!')
          .position('bottom left')
          .toastClass('md-primary')
          );
        DocumentResource.metadata({documentType: document.documentType}, function(response){
          if(response && response.data){
            document.documentID = response.data.documentID;
            document.replaceAction = false;
          }
        }, function(error){
          $log.error(error);
        });
      }, function(error){
        $log.debug(error);
        $rootScope.mainLoading = false;
        $mdToast.show(
          $mdToast.simple()
          .textContent('File Upload Failed!')
          .position('bottom right')
          .toastClass('md-warn')
          .hideDelay(2000)
          );

      }, function(evt){
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        $log.debug(progressPercentage);
            //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
          });        
    }
  }

}

export default documentComponent;
