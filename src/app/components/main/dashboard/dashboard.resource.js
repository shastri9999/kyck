'use strict';

function DashboardResource($resource, AppConstants) {
	'ngInject';
	
	const URL = AppConstants.URL;

    return $resource(URL, {}, {
    	userAppointments: {
    		method: 'GET',
    		isArray: false,
    		url: URL + '/dashboard/users'
    	},
    	brokerAppointments: {
    		method: 'GET',
    		isArray: false,
    		url: URL + '/dashboard/appointments'
    	},
    	brokerageApplications: {
    		method: 'GET',
    		isArray: false,
    		url: URL + '/dashboard/brokerages'    		
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