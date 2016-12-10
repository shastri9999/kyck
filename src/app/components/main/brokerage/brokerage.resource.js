'use strict';

var URL = '/kyck-rest';

function BrokerageResource($resource) {
	'ngInject';

    return $resource(URL, {}, {
        validationReports: {
            method: 'GET',
            isArray: false,
            params: {
                userId: '@id'
            },
            url: URL + '/ocr/data/validation/result'
        },
    	userAppointments: {
    		method: 'GET',
    		isArray: false,
    		url: URL + '/users/contacted'
    	},
        contactedBrokerages: {
            method: 'GET',
            isArray: false,
            url: URL + '/brokerages/contacted'
        },
    	brokeragesList: {
    		method : 'GET',
    		isArray: false,
    		url: URL + '/brokerage/findlist'
    	},
        //TO BE DONE
        updateApplication: {
            method: 'POST',
            isArray: false,
            params: {
                "status": "@status",
                "userId": "@userId"
            },
            url: URL + '/dashboard/application/status'
        },
        updateMeetingStatus: {
            method: 'POST',
            isArray: false,
            params: {
                "status": "@status",
                "userId": "@userId"
            },
            url: URL + '/calendar/update/appointmentstatus'
        },
        submitBrokerageApplication: {
            method: 'POST',
            url: URL + '/brokerage/submit'
        },
    	brokeragesDetails: {
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
        usermessages: {
            method: 'GET',
            isArray: false,
            url: URL + '/usermessage/brokerget'
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
    	},
        getroom: {
            method: 'POST',
            url: URL + '/webconf/getroom'
        }
    });
}

export default BrokerageResource;