'use strict';

function CalendarController($scope, $mdDialog, $filter, AuthenticationService, CalendarService, moment) {
	'ngInject';

	$scope.events = [

  ];
  console.log(AuthenticationService.getLoggedInUser());
  const userId = AuthenticationService.getLoggedInUser().userId;
  const isBroker = AuthenticationService.isBroker();
  const month = 11;
  CalendarService.fetchMeetings(userId, month).then((data)=>{
    $scope.events = data.map((slot)=>{
      console.log(slot);
      return {
        title: slot.meetingSubject,
        start: moment(slot.startTime, 'YYYY-MM_DD').toDate(),
        end: moment(slot.endTime, 'YYYY-MM_DD').toDate(),
        ...slot
      }
    });
  })
  
  $scope.eventClicked = function ($selectedEvent) {
   let closePopup = function() {
      alert = undefined;
   }
   const slot = $selectedEvent;
   alert = $mdDialog.alert({
    title: slot.meetingSubject,
    textContent: slot.meetingContent,
    ok: 'Close'
   });

    $mdDialog
    .show(alert)
    .finally(closePopup);
  }
  $scope.eventCreate = function ($date) {

  }
}

export default CalendarController;