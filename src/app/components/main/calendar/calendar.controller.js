'use strict';

import dialogTemplateURL from './dialog.html';

function CalendarController($scope, $mdDialog, $filter, AuthenticationService, CalendarService, moment, $rootScope) {
    'ngInject';

    $scope.events = [];

    $rootScope.loadingProgress = false;

    const userId = AuthenticationService.getLoggedInUser().userId;
    const isBroker = AuthenticationService.isBroker();
    const month = 11;
    fetchMeetings();

    function formatSlot(slot) {
        var st = moment(slot.startTime, 'DD/MM/YYYY hh:mm').toDate();
        var title = $filter('date')(st, "HH:mm a");
        return {
            title: title + " " + slot.meetingSubject,
            start: moment(slot.startTime, 'DD/MM/YYYY hh:mm').toDate(),
            end: moment(slot.endTime, 'DD/MM/YYYY hh:mm').toDate(),
            customClass: slot.status,
            ...slot
        }
    }

    function fetchMeetings() {
        if (!isBroker) {
            CalendarService.fetchMeetings(userId, month).then((data) => {
                $scope.events = data.map(formatSlot);
            });
        } else {
            CalendarService.fetchBrokerMeetings().then((data) => {
                $scope.events = data.map(formatSlot);
            });
        }
    }

    $scope.eventClicked = function($selectedEvent) {
        let closePopup = function() {
            alert = undefined;
        }

        var slot = $selectedEvent;

        $mdDialog.show({
            parent: angular.element(document.body),
            templateUrl: dialogTemplateURL,
            controller: DialogController
        });

        function DialogController($scope, $mdDialog) {
            'ngInject';
            $scope.slot = slot;
            $scope.isBroker = isBroker;
            $scope.updateAppointment = updateAppointment;
            // $scope.confirmAppointment = confirmAppointment;
            // $scope.rescheduleAppointment = rescheduleAppointment;
            console.log("slotis", slot, slot.calendarId, slot.startTime);

            $scope.closeDialog = function() {
                $mdDialog.hide();
            }

            function updateAppointment(status) {
                var calendarDetailRequest = {
                  "calendarId": slot.calendarId,
                  "meetingStatus": status
                };

                CalendarService.updateAppointmentStatus(calendarDetailRequest).then((data) => {
                    console.log(calendarDetailRequest);
                });

                fetchMeetings();

                $mdDialog.hide();
            }

            // function rescheduleAppointment() {

            // }
        }
    }

    $scope.eventCreate = function($date) {}
}

export default CalendarController;