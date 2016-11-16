'use strict';

import dialogTemplateURL from './dialog.html';

function CalendarController($scope, $mdDialog, $filter, AuthenticationService, CalendarService, moment, $rootScope) {
    'ngInject';

    $scope.events = [];

    $rootScope.loadingProgress = false;

    const userId = AuthenticationService.getLoggedInUser().userId;
    const isBroker = AuthenticationService.isBroker();
    const month = 11;

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

    if (!isBroker) {
        CalendarService.fetchMeetings(userId, month).then((data) => {
            console.log(data);
            $scope.events = data.map(formatSlot);
        });
    } else {
        CalendarService.fetchBrokerMeetings().then((data) => {
            console.log(data);
            $scope.events = data.map(formatSlot);
        });
    }

    $scope.eventClicked = function($selectedEvent) {
        let closePopup = function() {
            alert = undefined;
        }

        const slot = $selectedEvent;

        // alert = $mdDialog.alert({
        //   title: slot.meetingSubject,
        //   textContent: slot.meetingContent,
        //   ok: 'Close'
        // });

        $mdDialog.show({
            parent: angular.element(document.body),
            templateUrl: dialogTemplateURL,
            controller: DialogController
        });

        function DialogController($scope, $mdDialog) {
            'ngInject';
            $scope.slot = slot;

            $scope.closeDialog = function() {
                $mdDialog.hide();
            }
        }
    }

    $scope.eventCreate = function($date) {}
}

export default CalendarController;