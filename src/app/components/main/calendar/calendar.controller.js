'use strict';

function CalendarController($scope, $mdDialog, $filter) {
	'ngInject';

	$scope.events = [

  ];
  

  function getDate(offsetDays, hour) {
   offsetDays = offsetDays || 0;
   const offset = offsetDays * 24 * 60 * 60 * 1000;
   const date = new Date(new Date().getTime() + offset);
   if (hour) { date.setHours(hour); }
   return date;
 }

 $scope.eventClicked = function ($selectedEvent) {
   let textContent = "";
   let closePopup = function() {
    alert = undefined;
  }


  switch ($selectedEvent.customClass) {
    case "reschedule":
    textContent = "Kindly reschedule your appointment as broker is busy during the time mentioned by you";
    var txtBtn = "ReSchedule";
    closePopup = function() {
      alert = undefined;
    }
    break;
    case "confirmed" : 
    textContent = "Your appointment is confirmed.";
    break;
    case "pending" :
    textContent = "Broker has not taken any action on your request yet."
    break;
    case "rejected":
    textContent = "Your application has been rejected.";
    break;
  }

  alert = $mdDialog.alert({
   title: $filter('uppercase')($selectedEvent.customClass),
   textContent: textContent,
   ok: txtBtn || 'Close'
 });

  $mdDialog
  .show(alert)
  .finally(closePopup);
}
  $scope.eventCreate = function ($date) {
  	console.log($date);
  }
}

export default CalendarController;