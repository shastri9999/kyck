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

    function getStatus (status, isBroker) {
        var customClass="GREEN";
        var ifConfirmButton=true;
        var ifRescheduleButton=true;
        var formattedStatus=status;
        var extraContent="mauje mei";

        if (status=="CONFIRM") {
            formattedStatus="Confirmed"
        }
        else if (status == "REJECT") {
            formattedStatus="Rejected"
            customClass="RED";
            ifRescheduleButton=false;
        }
        else if (status == "RESCHEDULE") {
            if (isBroker) {
                customClass = "GOLDEN";
                formattedStatus="Pending"
            }
            else {
                formattedStatus="New Request"
                customClass = "RED";
            }
        }
        else if (status == "New Application") {
            extraContent = "Document Verification Call";
            if (isBroker) {
                customClass = "RED";
                formattedStatus = "New Request";
            }
            else {
                customClass = "GOLDEN";
                formattedStatus = "Pending";
            }
        }

        return [customClass, ifConfirmButton, ifRescheduleButton, formattedStatus, extraContent];
    }

    function formatSlot(slot) {
        var st = moment(slot.startTime, 'DD/MM/YYYY hh:mm').toDate();
        var title = $filter('date')(st, "HH:mm a");
        var vals = getStatus(slot.status, isBroker);

        return {
            title: title + " " + slot.meetingSubject,
            start: moment(slot.startTime, 'DD/MM/YYYY hh:mm').toDate(),
            end: moment(slot.endTime, 'DD/MM/YYYY hh:mm').toDate(),
            customClass: vals[0],
            ifConfirmButton: vals[1],
            ifRescheduleButton: vals[2],
            formattedStatus: vals[3],
            extraContent: vals[4],
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