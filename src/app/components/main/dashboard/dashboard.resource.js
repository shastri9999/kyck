'use strict';

var URL = '/kyck-rest';

function DashboardResource($resource) {
	'ngInject';

    return $resource(URL, {}, {
    	userAppointments: {
    		method: 'GET',
    		isArray: false,
    		url: URL + '/dashboard/users'
    	}
    });
}

export default DashboardResource;