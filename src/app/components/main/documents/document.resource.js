'use strict';

var URL = '/kyck-rest/document/';

function DocumentResource($resource, $rootScope) {
	'ngInject';
    return $resource(URL, {}, {
    	bulkDownload: {
    		method: 'GET',
    		isArray: false,
    		url: URL + 'bulkDownload',
            params: {
                documentNames: '@docNames',
                userId: '@userId'
            }
    	},
        download: {
            method: 'GET',
            params: {
                documentId: '@name'
            },
            url: URL + 'download/string64'
        },
        status: {
            method: 'GET',
            params: {
                documentId: '@name'
            },
            url: URL + 'download/status'
        },
        brokerdownload: {
            method: 'GET',
            params: {
                documentId: '@name',
                userId: '@userId'
            },
            url: URL + 'usr/download/string64'
        },
        categories: {
            method: 'GET',
            isArray: false,
            url: URL + 'categories'
        },
    	findall: {
    		method: 'GET',
    		isArray: false,
    		url: URL + 'findall'
    	},
        metadata: {
            method: 'GET',
            params: {
                documentType: '@type'
            },
            url: URL + 'metadata',
            isArray: false
        },
        brokermetadata: {
            method: 'GET',
            params: {
                documentType: '@type',
                userId:'@userId'
            },
            url: URL + 'usr/metadata',
            isArray: false
        },
        ocrdata: {
            method: 'GET',
            url: '/kyck-rest/ocr/data',
            isArray: false
        },
        upload: {
        	method: 'POST',
            params: {
                multipartFile: '@file',
     
                documentType: '@type'
            },
        	url: URL + 'upload',
        	isArray: false
        },
        uploadstatus: {
        	method: 'GET',
            params: {
                documentId: '@id'
            }, 
        	isArray: false,
        	url: URL + 'uploadstatus'
        },
        usrdownload: {
        	method: 'GET',
        	isArray: false,
        	params: {
        		documentId: '@id',
                userId: '@userId'
        	},
            responseType: 'arraybuffer',
        	url: URL + 'usr/download'
        }
    });
}

export default DocumentResource;