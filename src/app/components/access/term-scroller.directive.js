'use strict';
import $ from 'jquery';

function TermScroller($rootScope) {
	'ngInject';

  let directive = {
    restrict: 'A',
    link: function(scope, element, attributes){
     $(element).on('scroll', function(event){
       const height = event.target.scrollHeight - 570;
       if (event.target.scrollTop > height)
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
