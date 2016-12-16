'use strict';

function DashboardResource($resource, AppConstants) {
	'ngInject';
	
	const URL = AppConstants.URL;

    return $resource(URL, {}, {
    	userAppointments: {
    		method: 'GET',
    		isArray: false,
    		url: URL + '/users/contacted'
    	},
    	brokerAppointments: {
    		method: 'GET',
    		isArray: false,
            params: {
                "month": "@month",
                "year": "@year"
            },
    		url: URL + '/calendar/get/brokerappointments'
    	},
    	brokerageApplications: {
    		method: 'GET',
    		isArray: false,
    		url: URL + '/brokerages/contacted'    		
    	},
    	documentStatus: {
    		method: 'GET',
    		isArray: false,
    		url: URL + '/dashboard/documentstatus/status'
    	},
    	kycStatus: {
    		method: 'GET',
    		isArray: false,
    		url: URL + '/dashboard/userkycanswer/status'
    	},
        profileStatus: {
            method: 'GET',
            isArray: false,
            url: URL + '/dashboard/profile/status'
        },
        validationStatus: {
            method: 'GET',
            isArray: false,
            url: URL + '/dashboard/validation/status'
        }
    });
}

export default DashboardResource;