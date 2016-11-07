'use strict';

import directive from './profileform.directive';
const profileFormModule = angular.module('profile-form-module', []);
profileFormModule.directive('profileForm', directive);

export default profileFormModule;