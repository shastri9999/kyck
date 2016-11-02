'use strict';

var URL = 'http://ec2-54-255-136-1.ap-southeast-1.compute.amazonaws.com/kyck-rest/document/';

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
    			documentId: '@id'
    		},
    		url: URL + 'download'
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
        download: {
        	method: 'GET',
        	isArray: false,
        	params: {
        		documentId: '@id',
                userId: '@userId'
        	},
        	url: URL + 'usr/download'
        }
    });
}

export default DocumentResource;