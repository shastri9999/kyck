'use strict';

function CalendarController($scope, $mdDialog, $filter) {
	'ngInject';

	$scope.title = "My Bookings";

	$scope.events = [
    {
      start: getDate(-6, 10),
      end: getDate(-6, 11),
      customClass: 'reschedule',
      title: 'Event 1'
    },
    {
      start: getDate(-6, 9),
      end: getDate(-6, 10),
      customClass: 'confirmed',
      title: 'Event 1a'
    },
    {
      start: getDate(-6, 11),
      end: getDate(-6, 12),
      customClass: 'rejected',
      title: 'Event 1b'
    },
    {
      start: getDate(-6, 10),
      end: getDate(-6, 11),
      customClass: 'rejected',
      title: 'Event 1c'
    },
    {
      start: getDate(-6, 10),
      end: getDate(-6, 11),
      customClass: 'pending',
      title: 'Event 1d'
    },
    {
      start: getDate(-6, 10),
      end: getDate(-6, 11),
      customClass: 'confirmed',
      title: 'Event 1e'
    },
    {
      start: getDate(-6, 10),
      end: getDate(-6, 11),
      customClass: 'rejected',
      title: 'Event 1f'
    },
    {
      start: getDate(1, 11),
      end: getDate(2, 12),
      customClass: 'pending',
      title: 'Event 2'
    },
    {
      start: getDate(2, 12),
      end: getDate(3, 13),
      customClass: 'pending',
      title: 'Event 3'
    },
    {
      start: getDate(4, 12),
      end: getDate(5, 13),
      customClass: 'pending',
      title: 'Event 4'
    },
    {
      start: getDate(5, 12),
      end: getDate(6, 13),
      customClass: 'pending',
      title: 'Event 5'
    },
    {
      start: getDate(6, 12),
      end: getDate(6, 13),
      customClass: 'pending',
      title: 'Event 6'
    },
    {
      start: getDate(6, 12),
      allDay: true,
      customClass: 'pending',
      title: 'Event 7'
    },
    {
      start: getDate(8, 12),
      end: getDate(8, 13),
      customClass: 'pending',
      title: 'Event 5'
    },
    {
      start: getDate(8, 12),
      end: getDate(8, 13),
      customClass: 'pending',
      title: 'Event 6'
    },
    {
      start: getDate(8, 12),
      allDay: true,
      customClass: 'pending',
      title: 'Event 7'
    }
  ];
  
  // $scope.selected = $scope.events[0];

  function getDate(offsetDays, hour) {
	offsetDays = offsetDays || 0;
	var offset = offsetDays * 24 * 60 * 60 * 1000;
	var date = new Date(new Date().getTime() + offset);
	if (hour) { date.setHours(hour); }
	return date;
  }

  $scope.eventClicked = function ($selectedEvent) {
	console.log($selectedEvent);

	var textContent = "";

	var closePopup = function() {
          alert = undefined;
    }


	switch ($selectedEvent.customClass) {
		case "reschedule":
			textContent = "Kindly reschedule your appointment as broker is busy during the time mentioned by you";
			var txtBtn = "ReSchedule";
			closePopup = function() {
				console.log("ReScheduling");
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