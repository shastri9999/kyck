'use strict';

import UserService from './services/user.service';
import AuthenticationService from './services/authentication.service';
import StorageService from './services/storage.service.js';
import MessageService from './services/message.service.js';
import CalendarService from './services/calendar.service.js';
import PhoneService from './services/phone.service.js';
import CurrencyService from './services/currency.service.js';

const common = angular.module('common', []);
common.service("AuthenticationService", AuthenticationService);
common.service("UserService", UserService);
common.service("StorageService", StorageService);
common.service("MessageService", MessageService);
common.service("CalendarService", CalendarService);
common.service("PhoneService", PhoneService);
common.service("CurrencyService", CurrencyService);


common.filter('capitalize', function() {
    return function(input, all) {
      let reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
      return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
  });

common.directive("outsideClick", function( $document, $parse ){
	'ngInject';
    return {
        link: function( scope, element, attributes ){
            const scopeExpression = attributes.outsideClick,
                onDocumentClick = function(event){
                    const isChild = element.find(event.target).length > 0;
                    const clickedElement = angular.element(event.target);
                    const isSameElement = clickedElement.attr('outside-id')==attributes.outsideId;
                    if(!isChild && !isSameElement) {
                        scope.$apply(scopeExpression);
                    }
                };
            
            $document.on("click", onDocumentClick);
            
            element.on('$destroy', function() {
                $document.off("click", onDocumentClick);
            });
        }
    }
});

common.constant('AppConstants', {
	URL: '/kyck-rest'
})

export default common;