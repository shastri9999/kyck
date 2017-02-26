'use strict';
import dialogTemplateURL from './dialog.html';
import calSelectDialogURL from './calselect.html';

function CalendarController($scope, $mdDialog, $filter, AuthenticationService, BrokerageResource, CalendarService, moment, $rootScope, $window, $mdToast) {
    'ngInject';
    $scope.events = [];
    $rootScope.loadingProgress = false;
    const userId = AuthenticationService.getLoggedInUser().userId;
    const isBroker = AuthenticationService.isBroker();
    var curDate = new Date();
    const month = (new Date()).getMonth();
    fetchMeetings(curDate);
    setEventClick();
    $rootScope.$on('nextMonthCalendar', function ($event, args) {
        curDate.setMonth(curDate.getMonth() + 1);
        fetchMeetings(args);
    });
    $rootScope.$on('previousMonthCalendar', function ($event, args) {
        curDate.setMonth(curDate.getMonth() - 1);
        fetchMeetings(args);
    });

    function getStatus(status, isBroker) {
        var customClass = "GREEN";
        var ifConfirmButton = true;
        var ifRescheduleButton = true;
        var ifJoinVideoButton = true;
        var formattedStatus = status;
        var extraContent = "";
        if (status == "CONFIRM") {
            formattedStatus = "Confirmed";
            ifConfirmButton = false;
        }
        if (status == "PENDING") {
            formattedStatus = "Pending";
            customClass = "GOLDEN";
            ifConfirmButton = false;
            ifJoinVideoButton = false;
            if (isBroker) {
                ifConfirmButton = true;
                ifRescheduleButton = true;
            }
        }
        else if (status == "REJECT") {
            formattedStatus = "Rejected"
            customClass = "RED";
            ifJoinVideoButton = false;
            ifRescheduleButton = false;
            ifConfirmButton = false;
        }
        else if (status == "NEW" || status == "RESCHEDULE") {
            customClass = "GOLDEN";
            formattedStatus = "Pending";
            ifJoinVideoButton = false;
        }
        // else if (status == "RESCHEDULE") {
        //     // if (isBroker) {
        //         customClass = "GOLDEN";
        //         formattedStatus="Pending"
        //     // }
        //     // else {
        //     //     formattedStatus="New Request"
        //     //     customClass = "RED";
        //     // }
        // }
        // else if (status == "New Application") {
        //     extraContent = "Document Verification Call";
        //     // if (isBroker) {
        //     //     customClass = "RED";
        //     //     formattedStatus = "New Request";
        //     // }
        //     // else {
        //         customClass = "GOLDEN";
        //         formattedStatus = "Pending";
        //     // }
        // }
        return [customClass, ifConfirmButton, ifRescheduleButton, ifJoinVideoButton, formattedStatus, extraContent];
    }

    function formatSlot(slot) {
        var st = moment(slot.startTime, 'DD/MM/YYYY hh:mm').toDate();
        var title = $filter('date')(st, "HH:mm a");
        var vals = getStatus(slot.status, isBroker);
        return {
            title: slot.meetingSubject
            , start: moment(slot.startTime, 'DD/MM/YYYY hh:mm').toDate()
            , end: moment(slot.endTime, 'DD/MM/YYYY hh:mm').toDate()
            , customClass: vals[0]
            , ifConfirmButton: vals[1]
            , ifRescheduleButton: vals[2]
            , ifJoinVideoButton: vals[3]
            , formattedStatus: vals[4]
            , extraContent: vals[5]
            , ...slot
        }
    }

    function fetchMeetings(args) {
        $scope.events = [];
        if (!isBroker) {
            CalendarService.fetchMeetingsMonthWise(args.getMonth() + 1, args.getFullYear()).then((data) => {
                console.log(data);
                $scope.events = data.map(formatSlot);
            });
        }
        else {
            CalendarService.fetchBrokerMeetingsMonthWise(args.getMonth() + 1, args.getFullYear()).then((data) => {
                // var eles = document.getElementsByClassName('md-event-calendar-month-cell');
                // console.log(eles);
                // for (let n=0; n<eles.length; n++) {
                //     console.log(n, (($window.innerHeight - 250) / 5) + "px");
                //     eles[n].style.maxHeight = (($window.innerHeight - 200) / 5) + "px";
                // }
                $scope.events = data.map(formatSlot);
            });
        }
    }

    function setEventClick() {
        $scope.eventClicked = function ($selectedEvent) {
            let closePopup = function () {
                alert = undefined;
            }
            var slot = $selectedEvent;
            $mdDialog.show({
                parent: angular.element(document.body)
                , templateUrl: dialogTemplateURL
                , controller: DialogController
            });

            function DialogController($scope, $mdDialog) {
                'ngInject';
                slot['firstName'] = isBroker ? slot.userFirstName : slot.brokerFirstName;
                slot['lastName'] = isBroker ? slot.userLastName : slot.brokerLastName;
                console.log(slot);
                $scope.slot = slot;
                $scope.isBroker = isBroker;
                $scope.updateAppointment = updateAppointment;
                $scope.closeDialog = function () {
                    $mdDialog.hide();
                }
                var parentEl = angular.element(document.body);

                function updateAppointment(status) {
                    if (status == "JOIN") {
                        BrokerageResource.getroom({}, {
                            'calendarId': $scope.slot.calendarId
                            , 'userId': $scope.isBroker ? $scope.slot.userEmailId : $scope.slot.brokerEmailId
                        }, function (req) {
                            $rootScope.loadingProgress = false;
                            $window.open(req.data, 'Join Video Conferenence', 'width=1024,height=800');
                            $mdToast.showSimple("Invited for Video Conference.")
                        }, function (error) {
                            console.log(error);
                        });
                        $mdToast.showSimple("Invited for Video Conference.");
                    }
                    else if (status == "RESCHEDULE") {
                        var partner = {
                            'brokerageName': slot['brokerName']
                            , 'img': '/assets/images/partnerLogos/' + $scope.slot['brokerName'] + '.png'
                            , 'showCalendar': true
                            , 'selectedAppointments': []
                        };
                        var selectedPartners = [partner];
                        $mdDialog.show({
                            parent: parentEl
                            , templateUrl: calSelectDialogURL
                            , controller: DialogController2
                        });

                        function DialogController2($scope, $mdDialog) {
                            'ngInject';
                            $scope.selectedPartners = selectedPartners;
                            $scope.timeslotSelected = true;
                            $rootScope.$on('timeslotSelected', function (event, data) {
                                var calendarDetailRequest = {
                                    "calenderId": slot.calendarId
                                    , "calenderSlot": data[0].selectedAppointments[0]
                                    , "meetingContent": slot.meetingContent
                                    , "meetingLocation": slot.meetingLocation
                                    , "meetingStatus": isBroker ? "NEW" : "PENDING"
                                    , "meetingSubject": slot.meetingSubject
                                }
                                CalendarService.updateAppointmentEvent(calendarDetailRequest).then((data) => {
                                    $mdToast.showSimple("Meeting has been rescheduled.");
                                    fetchMeetings(curDate);
                                });
                            });
                            $scope.closeDialog = function () {
                                $mdDialog.hide();
                            }
                        }
                    }
                    else {
                        var calendarDetailRequest = {
                            "calenderId": slot.calendarId
                            , "meetingStatus": status
                        };
                        console.log(slot, calendarDetailRequest);
                        CalendarService.updateAppointmentStatus(calendarDetailRequest).then((data) => {
                            console.log(slot, calendarDetailRequest, data);
                            $mdToast.showSimple("Status of the meeting updated.");
                            fetchMeetings(curDate);
                        });
                    }
                    $mdDialog.hide();
                }
            }
        }
    }
    $scope.eventCreate = function ($date) {}
}
export default CalendarController;