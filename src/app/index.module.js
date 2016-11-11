import config from './index.config';
import Components from './index.components';
import Routes from './index.routes';
import Common from './common/common.module'

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
.run(function($rootScope, $location, AuthenticationService){
	'ngInject';

	/* Todo: Move all this to service */
	$rootScope.sideNavCollapsed = false;
	$rootScope.shouldShowDocumentPreview = false;
	$rootScope.documentPreviewLoading = false;
	$rootScope.documentPreviewURL = '/assets/images/nric.jpg'
	$rootScope.viewingDocument = {};
	$rootScope.OCRView = false;
	$rootScope.canEnableOCR = false;

	$rootScope.hideDocumentPreview = ()=>{
		$rootScope.shouldShowDocumentPreview = false;
		$rootScope.canEnableOCR = false;
		$rootScope.OCRView = false;	
	}
	
	$rootScope.showDocumentPreview = (URL)=>{
		if (URL)
		{
			$rootScope.documentPreviewLoading = false;
			$rootScope.documentPreviewURL = URL;
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

		/* Todo: Move all this to service */
		$rootScope.breadCrumb = next.breadCrumb;
		$rootScope.messageView.reply = "";
	});
});
