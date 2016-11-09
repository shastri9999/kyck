'use strict';

const d3 = require('d3');
const RadialProgressChart = require('radial-progress-chart');

function ProgressController(DashboardResource, AuthenticationService, $rootScope) {
	'ngInject';
	const vm = this;
	vm.currentUserId = AuthenticationService.getLoggedInUser().userId;
  const update = (again)=>{
     if (again)
     {
        angular.element(document.querySelector('.vertical.progress-chart')).empty();
     }
     Promise.all([DashboardResource.profileStatus({userId: vm.currentUserId}).$promise,
        DashboardResource.kycStatus({userId: vm.currentUserId}).$promise,
        DashboardResource.documentStatus({userId: vm.currentUserId}).$promise]).then((values)=>{
        return values.map(v=>v.data.percent)
      }).then((values)=>{
        const profileStatus = +values[0];
        const kycStatus = +values[1];
        const documentStatus = +values[2];
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
                labelStart: kycStatus + '%',
                value: kycStatus,
                color: {
                  solid: '#f7b92f',
                  background: '#fde6b2'
                }
              },
              {
                labelStart: profileStatus + '%',
                value: profileStatus,
                color: {
                  solid: '#4bb7f5',
                  background: '#c9e9fc'
                }
              },
              {
                labelStart: documentStatus + '%',
                value: documentStatus,
                color: {
                  solid: '#00ccad',
                  background: '#a6edee'
                }
              }
            ]
          });
      });   
  }
  update();
	$rootScope.$on('updateProgressChart', (event, data)=>{
    console.log('Chart update is called');
    update(true);
  })
}

export default ProgressController;