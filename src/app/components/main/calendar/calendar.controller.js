'use strict';

function CalendarController($scope, $mdDialog, $filter, AuthenticationService, CalendarService, moment, $rootScope) {
	'ngInject';

	$scope.events = [

  ];

  $rootScope.loadingProgress = false;
  
  const userId = AuthenticationService.getLoggedInUser().userId;
  const isBroker = AuthenticationService.isBroker();
  const month = 11;
  if (!isBroker)
  {
    CalendarService.fetchMeetings(userId, month).then((data)=>{
      console.log(data);
      $scope.events = data.map((slot)=>{
        return {
          title: slot.meetingSubject,
          start: moment(slot.startTime, 'DD/MM/YYYY hh:mm').toDate(),
          end: moment(slot.endTime, 'DD/MM/YYYY hh:mm').toDate(),
          ...slot
        }      
      });
    });
  }
  else
  {
    CalendarService.fetchBrokerMeetings().then((data)=>{
      $scope.events = data.map((slot)=>{
        return {
          title: slot.meetingSubject,
          start: moment(slot.startTime, 'DD/MM/YYYY hh:mm').toDate(),
          end: moment(slot.endTime, 'DD/MM/YYYY hh:mm').toDate(),
          ...slot
        }
      });
    });
  }
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