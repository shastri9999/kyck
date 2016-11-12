'use strict';

import documentHtml from './document.html';
import './document.scss';

function documentComponent($log, $state, Upload, DocumentResource) {
	'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: documentHtml,
    controller: DocumentController,
    bindToController: true,
    document: '=',
    isBroker: '='
  };

  return directive;

  function DocumentController ($scope, $mdToast) {
    'ngInject';
	  $log.debug('Hello from Document controller!');

    $scope.upload = function(file, document){
        $log.debug(file);
        //$state.go('main.document.preview',{ picFile: file});
        
        Upload.upload({
          url: '/kyck-rest/document/upload?documentType='+document.documentType,
          data: {
            file: file
          }
        }).then(function(response){
            $log.debug(response);
            $log.debug('Success: ' + response.config.data.file.name + 'Uploaded. Response: ' + response.data);
            $mdToast.show(
              $mdToast.simple()
                .textContent('File Uploaded!')
                .position('bottom right')
                .toastClass('md-primary')
                .hideDelay(2000)
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
        
        
       //DocumentResource.upload({mul})
    }
  }

}

export default documentComponent;
