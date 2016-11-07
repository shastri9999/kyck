'use strict';

import directive from './kycform.directive';
const kycFormModule = angular.module('kyc-form-module', []);
kycFormModule.directive('kycForm', directive);

export default kycFormModule;