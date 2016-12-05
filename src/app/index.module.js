import config from './index.config';
import Components from './index.components';
import Routes from './index.routes';
import Common from './common/common.module'
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';

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
.run(function($rootScope, $location, AuthenticationService, $http, $timeout, Upload){
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
	$rootScope.shouldShowDocumentPreview = false;
	$rootScope.documentPreviewLoading = false;
	$rootScope.documentPreviewURL = '/assets/images/nric.jpg'
	$rootScope.viewingDocument = {};
	$rootScope.OCRView = false;
	$rootScope.canEnableOCR = false;
	$rootScope.cropping = false;
	$rootScope.originalPreviewURL = null;
	$rootScope.croppedBlob = null;

	window.cropper = null;

	$rootScope.toggleCropper = ()=>{
		if (window.cropper)
		{
			const canvasElement = window.cropper.getCroppedCanvas();
			$rootScope.documentPreviewURL = canvasElement.toDataURL();
			canvasElement.toBlob((blob)=>{
				blob.name = $rootScope.viewingDocument.documentName;
				$rootScope.croppedBlob = blob;
				window.cropper.destroy();
				window.cropper = null;
				$rootScope.cropping = false;
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

	$rootScope.resetCropper = ()=>{
		if (window.cropper && $rootScope.cropping)
			window.cropper.reset();
		else
			$rootScope.documentPreviewURL = $rootScope.originalPreviewURL;
		$rootScope.croppedBlob = null;
	}

	$rootScope.uploadCroppedImage = ()=>{
		if ($rootScope.documentPreviewURL == $rootScope.originalPreviewURL && !$rootScope.croppedBlob)
			return;
		$rootScope.cropping = false;
		$rootScope.documentPreviewLoading = true;
		const blob = $rootScope.croppedBlob; //Upload.dataUrltoBlob($rootScope.documentPreviewURL, $rootScope.viewingDocument.documentName);
		Upload.upload({
			url: '/kyck-rest/document/upload?documentType='+ $rootScope.viewingDocument.documentType,
			data: {
			  file: blob
			}
		}).then((response)=>{
			$rootScope.cropping = true;
			$rootScope.documentPreviewLoading = false;
			$rootScope.originalPreviewURL = $rootScope.documentPreviewURL;
		}).catch((e)=>{
			$rootScope.cropping = true;
			$rootScope.documentPreviewLoading = false;			
		});
	}

	$rootScope.closeCropper = ()=>{
		$rootScope.documentPreviewURL = $rootScope.originalPreviewURL;
		if (window.cropper)
		{
			window.cropper.destroy();
			window.cropper = null;
			$rootScope.cropping = false;
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
		if (window.cropper)
		{
			window.cropper.destroy();
			window.cropper = null;
		}
	}
	
	$rootScope.showDocumentPreview = (URL)=>{
		if (URL)
		{
			$rootScope.documentPreviewLoading = false;
			$rootScope.documentPreviewURL = URL;
			$rootScope.originalPreviewURL = $rootScope.documentPreviewURL;
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
