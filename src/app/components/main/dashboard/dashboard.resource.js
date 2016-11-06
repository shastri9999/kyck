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
    	}
    });
}

export default DashboardResource;