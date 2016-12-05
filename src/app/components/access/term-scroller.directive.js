'use strict';
import $ from 'jquery';

function TermScroller($rootScope) {
	'ngInject';

  let directive = {
    restrict: 'A',
    link: function(scope, element, attributes){
     $(element).on('scroll', function(event){
       if (event.target.scrollTop > 5710)
       {
          $rootScope.$apply(()=>{
            $rootScope.terms.agreeEnabled = true;
          })
       }
     });
   }
 };

 return directive;
}

export default TermScroller;
