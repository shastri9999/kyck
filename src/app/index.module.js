import config from './index.config';
import Components from './index.components';
import Routes from './index.routes';
import Common from './common/common.module'
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';
import pdfjsLib from 'pdfjs-dist';
pdfjsLib.PDFJS.workerSrc = '../../build/webpack/pdf.worker.bundle.js';
window.pdfjsLib = pdfjsLib;

export default angular.module('kyck', [
	'ui.router',
	'ngAnimate', 
	'ngCookies', 
	'ngSanitize', 
	'ngMessages', 
	'ngAria', 
	'oc.lazyLoad',
	'ngMaterial',
	'ngResource',
	'ngFileUpload',
	'uiCropper',
	'angularMoment',
	Common.name,
	Components.name,
	Routes.name
	]
	)
.config(config)
.run(function($rootScope, $location, AuthenticationService, DocumentResource, MessageService, $http, $timeout, $mdToast, Upload){
	'ngInject';

	/* Todo: Move all this to service */
	$rootScope.terms = {
		agree: false,
		show: false,
		agreeEnabled: false
	};
	$rootScope.agreeTerms = ()=>{
		if ($rootScope.terms.agreeEnabled)
		{
			$rootScope.terms.agree = true;
			$rootScope.terms.show = false;
		}
	};

	$rootScope.sideNavCollapsed = false;
	$rootScope.sideNavExpanded = false;
	$rootScope.shouldShowDocumentPreview = false;
	$rootScope.documentPreviewLoading = false;
	$rootScope.documentPreviewURL = '';
	$rootScope.viewingDocument = {};
	$rootScope.OCRView = false;
	$rootScope.canEnableOCR = false;
	$rootScope.cropping = false;
	$rootScope.originalPreviewURL = null;
	$rootScope.croppedBlob = null;
	$rootScope.pdfView = false;
	$rootScope.unreadMessages = 0;
	
	MessageService.unread().then(count=>$rootScope.unreadMessages=count);

	window.cropper = null;

	$rootScope.toggleCropper = ()=>{
		if ($rootScope.pdfView) return;
		if (window.cropper)
		{
			const canvasElement = window.cropper.getCroppedCanvas();
			$rootScope.cropping = false;
			$rootScope.documentPreviewURL = canvasElement.toDataURL();
			canvasElement.toBlob((blob)=>{
				blob.name = $rootScope.viewingDocument.documentName;
				$rootScope.croppedBlob = blob;
				window.cropper.destroy();
				window.cropper = null;
			});
		}
		else
		{
			const image = document.getElementById('image');
			window.cropper = new Cropper(image, {
			  aspectRatio: NaN,
			  dragMode: 'move',
			});
			$rootScope.cropping = true;
		}
	}

	$rootScope.rotateCropper = (value)=>{
		if (window.cropper)
		{
			window.cropper.rotate(value)
		}
	}

	$rootScope.resetCropper = ()=>{
		if (window.cropper)
		{
			window.cropper.reset();
			window.cropper.destroy();
			window.cropper = null;
		}

		$rootScope.documentPreviewURL = $rootScope.originalPreviewURL;
		$rootScope.cropping = false;
		$rootScope.croppedBlob = null;
	}

	$rootScope.uploadCroppedImage = ()=>{
		if ($rootScope.documentPreviewURL == $rootScope.originalPreviewURL && !$rootScope.croppedBlob && !$rootScope.setUpload)
			return;
		$rootScope.cropping = false;
		$rootScope.documentPreviewLoading = true;
		const blob = $rootScope.croppedBlob;
		if(!blob && $rootScope.setUpload)
		{
			debugger;
			Upload.urlToBlob($rootScope.documentPreviewURL).then(function(blob) {
				Upload.upload({
					url: '/kyck-rest/document/upload?documentType='+ $rootScope.viewingDocument.documentType,
					data: {
					  file: blob
					}
				}).then((response)=>{
					
					DocumentResource.metadata({documentType: $rootScope.viewingDocument.documentType}, function(response){
			          if(response && response.data){
			            $rootScope.viewingDocument.documentID = response.data.documentID;
			            $rootScope.viewingDocument.replaceAction = false;
			        	$rootScope.hideDocumentPreview();
			            $mdToast.show(
				          $mdToast.simple()
				          .textContent('File Uploaded Successfully!')
				          .position('bottom left')
				          .toastClass('md-primary')
				          );
			          }
			        }, function(error){
			          console.log(error);
			        });
				}).catch((e)=>{
					$rootScope.cropping = true;
					$rootScope.documentPreviewLoading = false;			
				});
				
			});
		}
		else {
			Upload.upload({
				url: '/kyck-rest/document/upload?documentType='+ $rootScope.viewingDocument.documentType,
				data: {
				  file: blob
				}
			}).then((response)=>{
				$rootScope.cropping = true;
				$rootScope.documentPreviewLoading = false;
				$rootScope.originalPreviewURL = $rootScope.documentPreviewURL;
				$rootScope.setUpload = false;
			}).catch((e)=>{
				$rootScope.cropping = true;
				$rootScope.documentPreviewLoading = false;			
			});
		}
	}

	$rootScope.hideDocumentPreview = ()=>{
		$rootScope.shouldShowDocumentPreview = false;
		$rootScope.canEnableOCR = false;
		$rootScope.OCRView = false;	
		$rootScope.cropping = false;
		$rootScope.croppedBlob = null;
		$rootScope.originalPreviewURL = null;
		$rootScope.documentPreviewURL = null;
		$rootScope.pdfView = false;
		$rootScope.setUpload = false;
		if (window.cropper)
		{
			window.cropper.destroy();
			window.cropper = null;
		}
	}
	
	$rootScope.showDocumentPreview = (URL, setUpload)=>{
		$rootScope.documentPreviewURL = '';
		$rootScope.originalPreviewURL = $rootScope.documentPreviewURL;
		$rootScope.setUpload = false;
		if (URL)
		{
			if (URL.slice(0,20) === 'data:application/pdf')
			{
				$rootScope.pdfView = true;
				$rootScope.documentPreviewURL = URL;
				$rootScope.originalPreviewURL = $rootScope.documentPreviewURL;
				const loadingTask = pdfjsLib.getDocument(URL);
				loadingTask.promise.then(function (pdfDocument) {
				  return pdfDocument.getPage(1).then(function (pdfPage) {
				  	$rootScope.pdfPage = pdfPage;
				    const canvas = document.getElementById('pdf-canvas');
				    const viewport = pdfPage.getViewport(canvas.width / pdfPage.getViewport(1.0).width);
        			canvas.height = viewport.height;
				    const ctx = canvas.getContext('2d');
					$rootScope.$apply(()=>{
						$rootScope.documentPreviewLoading = false;
					});
				    const renderTask = pdfPage.render({
				      canvasContext: ctx,
				      viewport: viewport
				    });
				    return renderTask.promise;
				  });
				}).catch(function (reason) {
				  console.error('Error: ' + reason);
				});
			}
			else
			{
				$rootScope.pdfView = false;
				$rootScope.documentPreviewLoading = false;
				$rootScope.documentPreviewURL = URL;
				$rootScope.originalPreviewURL = $rootScope.documentPreviewURL;
				$rootScope.setUpload = !!setUpload;
			}
		}
		else
		{
			$rootScope.documentPreviewLoading = true;
			$rootScope.documentPreviewURL = '/assets/images/loading.gif'
			$rootScope.viewingDocument = {};
		}
		$rootScope.shouldShowDocumentPreview = true;
	}

	$rootScope.showOCRView = ()=>{
		if ($rootScope.viewingDocument.OCR)
			$rootScope.OCRView = true;
	}

	$rootScope.closeOCRView = ()=>{
		$rootScope.OCRView = false;
		$timeout(()=>{
			if ($rootScope.pdfPage)
			{
				const pdfPage = $rootScope.pdfPage;
			    const canvas = document.getElementById('pdf-canvas');
			    const viewport = pdfPage.getViewport(canvas.width / pdfPage.getViewport(1.0).width);
				canvas.height = viewport.height;
			    const ctx = canvas.getContext('2d');
			    pdfPage.render({
			      canvasContext: ctx,
			      viewport: viewport
			    });
			    $rootScope.$apply(()=>{
				    $rootScope.documentPreviewLoading = false;
			    });
			}
		}, 100);
	}

	$rootScope.messageView = {
		activeInboxMessage: null,
		activeSentMessage: null,
		composing: false,
		reply: ""
	};

	$rootScope.$on('$stateChangeStart', function (event, next, toParams) {
		const loggedIn = AuthenticationService.getLoggedInUser();
		const isAccessPage = next.name.indexOf("access.")==0;
		if (!loggedIn && !isAccessPage) {
			$location.url('/signin');              	
		}
		else
		{
			AuthenticationService.checkSignedIn();
		}
		
		/* Todo: Move all this to service */
		$rootScope.breadCrumb = next.breadCrumb;
		$rootScope.messageView.reply = "";
	});
});
