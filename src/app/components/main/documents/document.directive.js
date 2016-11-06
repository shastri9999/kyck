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
    document: '='
  };

  return directive;

  function DocumentController ($scope) {
    'ngInject';
	  $log.debug('Hello from Document controller!');
    $scope.upload = function(file, documentType){
        $log.debug(file);
        //$state.go('main.document.preview',{ picFile: file});
        Upload.upload({
          url: '/kyck-rest/document/upload',
          data: {
            multipartFile: file,
            documentType: documentType
          }
        }).then(function(response){
            $log.debug(response);
            $log.debug('Success: ' + response.config.data.file.name + 'Uploaded. Response: ' + resp.data);
        }, function(error){
            $log.debug(error);
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
