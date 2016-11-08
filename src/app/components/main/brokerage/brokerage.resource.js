'use strict';

var URL = '/kyck-rest';

function BrokerageResource($resource) {
	'ngInject';

    return $resource(URL, {}, {
    	userAppointments: {
    		method: 'GET',
    		isArray: false,
    		url: URL + '/users/contacted'
    	},
        contactedBrokerages: {
            method: 'GET',
            isArray: false,
            url: URL + '/dashboard/brokerages'
        },
    	brokeragesList: {
    		method : 'GET',
    		isArray: false,
    		url: URL + '/brokerage/findlist'
    	},
        //TO BE DONE
        userprofileupdate: {
            method: 'POST',
            params: {
                  "brokerageCalenderSlotList": [
                    {
                          "brokerageId": "@string",
                          "calenderSlot": "@date",
                          "meetingContent": "@string",
                          "meetingLocation": "@string",
                          "meetingStatus": "@string",
                          "meetingSubject": "@string"
                        }
                      ]
                },
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

export default BrokerageResource;