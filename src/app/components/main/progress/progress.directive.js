'use strict';

import templateUrl from './progress.html';
import controller from './progress.controller'
const d3 = require('d3');
const RadialProgressChart = require('radial-progress-chart');

function ProgressComponent() {
	'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl,
    controller,
    bindToController: true,
    link: function(scope, element, attributes){
      const progress = new RadialProgressChart('.progress-chart', {
        diameter: 110,
        shadow: {
          width: 0
        },
        stroke: {
          width: 20,
          gap: 2
        },
        animation: {
          duration: 1
        },
        series: [
          {
            labelStart: '20%',
            value: 20,
            color: {
              solid: '#f7b92f',
              background: '#fde6b2'
            }
          },
          {
            labelStart: '75%',
            value: 75,
            color: {
              solid: '#4bb7f5',
              background: '#c9e9fc'
            }
          },
          {
            labelStart: '65%',
            value: 65,
            color: {
              solid: '#00ccad',
              background: '#a6edee'
            }
          }
        ]
      });
    }
  };
  return directive;
}

export default ProgressComponent;
