'use strict';

import UserService from './services/user.service';
import AuthenticationService from './services/authentication.service';
import StorageService from './services/storage.service.js';

const common = angular.module('common', []);

[AuthenticationService, 
UserService, 
StorageService]
.forEach(service=>common.service(service.name, service));

common.constant('AppConstants', {
	URL: 'http://ec2-54-255-136-1.ap-southeast-1.compute.amazonaws.com/kyck-rest/'
})

export default common;