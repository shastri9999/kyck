'use strict';


function MiniCalendarController($scope, CalendarService, moment, $rootScope, $filter) {
	'ngInject';

	$scope.events = [];
	CalendarService.fetchBrokerMeetings().then((data)=>{
      $scope.events = data.map((slot)=>{
      	var st = moment(slot.startTime, 'DD/MM/YYYY hh:mm').toDate();
      	var title = $filter('date')(st, "HH:mm a");
        return {
          title: title + " " + slot.meetingSubject,
          start: st,
          end: moment(slot.endTime, 'DD/MM/YYYY hh:mm').toDate(),
          ...slot
        }
      });
      console.log($scope.events);
    });
}

export default MiniCalendarController;