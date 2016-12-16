'use strict';

import directive from './selectslot.directive';
const selectSlotModule = angular.module('select-slot-module', ['material.components.eventCalendar']);
selectSlotModule.directive('selectSlot', directive);

export default selectSlotModule;