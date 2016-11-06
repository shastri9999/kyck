'use strict';

var URL = '/kyck-rest';

function RequestsResource($resource) {
	'ngInject';

    return $resource(URL, {}, {
    	requestsDetails: {
    		method: 'GET',
    		isArray: false,
    		params: {
    			userEmailId: '@email'
    		},
    		url: URL + '/brokerages/details'
    	},
    	userprofileget: {
    		method: 'GET',
    		isArray: false,
    		url: URL + '/userprofile/findall/action'
    	},
    	userprofileupdate: {
    		method: 'POST',
    		params: {
    			userInputMessage: '@content'
    		},
    		url: URL + '/userprofile/update/action'
    	},
    	kycget: {
    		method: 'GET',
    		isArray: false,
    		url: URL + '/kyckuseranswer/findall/action'
    	},
    	kycupdate: {
    		method: 'POST',
    		params: {
    			kycUserAnswerList: '@content'
    		},
    		url: URL + '/kyckuseranswer/update/action'
    	}
    });
}

export default RequestsResource;