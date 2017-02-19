'use strict';
import inviteDialogTemplateUrl from './dialog.html';
const d3 = require('d3');
const RadialProgressChart = require('radial-progress-chart');

function BrokerageController($state, $scope, $mdToast, $http, $mdStepper, $mdDialog, $rootScope, BrokerageResource, AuthenticationService, DocumentResource, DashboardResource, UserService, CalendarService, $window, moment, MessageService, Upload) {
    'ngInject';
    var vm = this;
    init();

    function convert(obj) {
        obj['img'] = '/assets/images/partnerLogos/' + obj['brokerageName'] + '.png';
        return obj;
    }
    vm.check = () => {
        if (vm.getActiveStep() == 1 && vm.isBroker) {
            if (!document.querySelector('.chart svg')) {
                vm.charts = [];
                drawCharts();
            }
        }
    }

    function updateBrokers() {
        $rootScope.loadingProgress = true;
        BrokerageResource.contactedBrokerages((response) => {
            vm.contactedBrokers = response.data;
            vm.filteredContactedBrokers = vm.contactedBrokers;
            BrokerageResource.brokeragesList((req) => {
                $rootScope.loadingProgress = false;
                var brokeragesList = req.data;
                vm.partners = brokeragesList.map(convert);
                vm.partners = vm.partners.map((partner) => {
                    vm.contactedBrokers.forEach((broker) => {
                        if (broker.brokerageId == partner.brokerageName) {
                            partner.status = broker.status;
                        }
                    });
                    return partner;
                })
                vm.premiumPartnersCount = brokeragesList.filter(function (obj) {
                    return obj['brokerageCategory'] == 'PREMIUM'
                }).length;
            });
        });
        $scope.selectedPartners = [];
    }
    $rootScope.$on('resetBrokersList', function ($event, e) {
        init();
    });
    vm.steps = ["Select Broker", "Personal Details", "KYC", "Documents", "Selection of Timeslot"]

    function setUserAppointments() {
        BrokerageResource.userAppointments((response) => {
            $rootScope.loadingProgress = false;
            vm.userAppointments = response.data;
            vm.userAppointmentsFiltered = vm.userAppointments;
            $scope.firstAppointment = '<div class="appointment ng-scope" ng-click="vm.selectUser(0)">' + '<div class="avatar-circle">' + vm.userAppointmentsFiltered[0].fname[0].toUpperCase() + vm.userAppointmentsFiltered[0].lname[0].toUpperCase() + '</div>' + '<div class="detail">' + '<div style="font-size: 14px;" class="ng-binding">' + vm.userAppointmentsFiltered[0].fname + vm.userAppointmentsFiltered[0].lname + '</div>' + '<a class="pending-btn ng-binding" style="margin-top: 4px;">' + vm.userAppointmentsFiltered[0].applicationStatus + '</a>' + '</div>' + '</div>';
            //            shuffletheorder();
            vm.userAppointment = vm.userAppointments[0];
            if (vm.userAppointments.length > 0 && vm.firstTime) {
                selectUser(0);
            }
        });
    }

    function drawCharts() {
        Promise.all([DashboardResource.profileStatus({
                userId: vm.userAppointment.email
            }).$promise
            , DashboardResource.kycStatus({
                userId: vm.userAppointment.email
            }).$promise
            , DashboardResource.documentStatus({
                userId: vm.userAppointment.email
            }).$promise
            , DashboardResource.validationStatus({
                userId: vm.userAppointment.email
            }).$promise
            ]).then((values) => {
            return values.map(v => +v.data.percent)
        }).then((values) => {
            const mappings = [{
                    'name': 'profile'
                    , 'solid': '#4bb7f5'
                    , 'background': '#c9e9fc'
                }
                , {
                    'name': 'kyc'
                    , 'solid': '#f7b92f'
                    , 'background': '#fde6b2'
                }
                , {
                    'name': 'document'
                    , 'solid': '#00ccad'
                    , 'background': '#a6edee'
                }
                , {
                    'name': 'validation'
                    , 'solid': '#8a88cd'
                    , 'background': '#c9e9ff'
                }];
            vm.statusValues = values;
            if (!vm.charts || !vm.charts.length) {
                vm.charts = values.map((value, index) => {
                    const mapping = mappings[index];
                    return new RadialProgressChart('.broker-' + mapping.name + '-chart', {
                        diameter: 55
                        , shadow: {
                            width: 0
                        }
                        , stroke: {
                            width: 6
                        , }
                        , animation: {
                            duration: 1
                        }
                        , center: function (p) {
                            return p + "%";
                        }
                        , series: [
                            {
                                value: value
                                , color: {
                                    solid: mapping.solid
                                    , background: mapping.background
                                }
                            }]
                    });
                });
            }
            else {
                values.forEach((value, index) => {
                    vm.charts[index].update(value);
                });
            }
        });
    }

    function init() {
        vm.firstTime = true;
        vm.nextStep = nextStep;
        vm.backStep = backStep;
        vm.nextRequestStep = nextRequestStep;
        vm.selectedIndex = 0;
        vm.getActiveStep = getActiveStep;
        vm.isBroker = $scope.isBroker = AuthenticationService.isBroker();
        vm.selectUser = selectUser;
        vm.getSelectedUserEmail = getSelectedUserEmail;
        $scope.selectedPartners = [];
        $scope.timeslotSelected = false;
        vm.kycerror = false;
        vm.personalDetailsError = false;
        vm.submitApplication = submitApplication;
        vm.updateMeetingStatus = updateMeetingStatus;
        vm.showVideoDialog = showVideoDialog;
        vm.usermessages = [];
        vm.selectedDocumentNames = [];
        vm.bgurl = AuthenticationService.getBGURL();
        vm.toggleShowPartner = toggleShowPartner;
        vm.addAttachment = addAttachment;
        vm.sendMessage = sendMessage;
        vm.upload = upload;
        vm.showRightDrawer = showRightDrawer;
        // vm.removeAttachment = removeAttachment;
        vm.changeUsers = changeUsers;
        vm.changeBrokerageApplications = changeBrokerageApplications;
        $rootScope.loadingProgress = false;
        $rootScope.$on('timeslotSelected', function (event, data) {
            $scope.timeslotSelected = true;
        });
        $rootScope.$on('brokerageSubmitted', function ($event, e) {
            updateBrokers();
        });
        if (!vm.isBroker) {
            updateBrokers();
            $rootScope.loadingProgress = true;
            DocumentResource.categories(function (response) {
                $rootScope.loadingProgress = false;
                vm.documents = response.data;
                vm.documents.forEach(function (doc) {
                    doc.documentID = null;
                    doc.replaceAction = false;
                });
                DocumentResource.findall((response) => {
                    const documents = response.data;
                    documents.forEach(function (existingDoc) {
                        for (var i = 0; i < vm.documents.length; i++) {
                            if (existingDoc.documentType == vm.documents[i].documentType) {
                                vm.documents[i].documentID = existingDoc.documentID;
                                vm.documents[i].documentName = existingDoc.documentName;
                                vm.documents[i].mimeType = existingDoc.mimeType;
                                break;
                            }
                        }
                    });
                });
            }, function (error) {});
        }
        else {
            $rootScope.sideNavCollapsed = true;
        }
        $rootScope.loadingProgress = true;
        BrokerageResource.userprofileget(function (response) {
            $rootScope.loadingProgress = false;
            var questions = response.data;
            vm.questionsmap = {};
            questions.forEach(function (q) {
                vm.questionsmap[q.questionDesc] = q;
            });
        }, function (error) {});
        $rootScope.loadingProgress = true;
        BrokerageResource.kycget(function (response) {
            $rootScope.loadingProgress = false;
            var questions = response.data;
            vm.kycquestions = {};
            questions.forEach(function (q) {
                vm.kycquestions[q.questionDesc] = q;
            });
        }, function (error) {});
        vm.toggleSelected = function (partner) {
            if (partner.status) return;
            partner.selected = !partner.selected;
            if (partner.selected) {
                $scope.selectedPartners.push(partner);
            }
            else {
                $scope.selectedPartners = $scope.selectedPartners.filter(function (obj) {
                    return obj.brokerageId !== partner.brokerageId;
                })
            }
            if ($scope.selectedPartners.length > 1) {
                var steppers = $mdStepper('stepper-demo');
            }
        }
        if (vm.isBroker) {
            $rootScope.loadingProgress = true;
            setUserAppointments();
            vm.getDownloadLink = () => {
                if (vm.userAppointment && vm.selectedDocumentNames.length) return '/kyck-rest/document/bulkDownload?' + 'userId=' + vm.userAppointment.email + '&documentNames=' + vm.selectedDocumentNames.join(',');
                return '';
            }
            vm.toggleAllDocuments = () => {
                let selection = [];
                vm.brokeragesDetails.document.forEach((doc) => {
                    selection.push(doc.documentName);
                });
                if (selection.length == vm.selectedDocumentNames.length) {
                    vm.selectedDocumentNames = [];
                }
                else {
                    vm.selectedDocumentNames = selection;
                }
            }
            vm.hasDocument = function (document) {
                return (vm.selectedDocumentNames.indexOf(document.documentName) >= 0);
            }
            vm.toggleDocument = function (document) {
                const name = document.documentName;
                const index = vm.selectedDocumentNames.indexOf(document.documentName);
                if (index >= 0) {
                    vm.selectedDocumentNames.splice(index, 1);
                }
                else {
                    vm.selectedDocumentNames.push(document.documentName)
                }
            }
        }
    }

    function shuffletheorder() {
        function statusToNum(status) {
            if (status == 'PENDING') return 0;
            if (status == 'APPROVED') return 1;
            if (status == 'REJECT') return 2;
        }
        vm.userAppointments.sort(function (a, b) {
            if (statusToNum(a.applicationStatus) < statusToNum(b.applicationStatus)) return -1;
            else if (statusToNum(a.applicationStatus) === statusToNum(b.applicationStatus)) return 0;
            else return 1;
        });
    }

    function submitApplication(status) {
        $rootScope.loadingProgress = true;
        $scope.timeslotSelected = false;
        //            "brokerageId": AuthenticationService.getLoggedInUser().userId
        BrokerageResource.updateApplication({
            "status": status
            , "userId": vm.userAppointment.email
        }, function (response) {
            console.log(response, status, vm.userAppointment.email);
            $rootScope.loadingProgress = false;
            $mdToast.showSimple("Application has been successfully " + status.toLowerCase() + ".");
            //            vm.userAppointment.applicationStatus = status;
            vm.allVerified = false;
            setUserAppointments();
            // vm.selectedIndex = vm.userAppointments.findIndex(function (a) {return a.email == vm.userAppointment.email;})
            //            shuffletheorder();
        }, function (error) {
            console.log(error);
        });
    }

    function updateMeetingStatus(status, slot) {
        function formatStatus(status) {
            var t = status.toLowerCase();
            if (t == "CONFIRM") return "confirmed";
            if (t == "RESCHEDULE") return "rescheduled";
            else return t;
        }
        $rootScope.loadingProgress = true;
        BrokerageResource.updateMeetingStatus({
            "meetingStatus": status
            , "calenderId": slot.calendarId
        }, function (response) {
            CalendarService.fetchBrokerMeetings().then((data) => {
                $rootScope.loadingProgress = false;
                vm.userSlots = data.filter(function (a) {
                    return a.userEmailId === vm.userAppointment.email;
                });
                vm.userSlots.map(function (a) {
                    a['startTime'] = moment(a['startTime'], 'DD/MM/YYYY hh:mm').toDate();
                })
            });
            // vm.userAppointments[vm.selectedIndex]['applicationStatus'] = "APPROVED";
            $mdToast.showSimple("Appointment slot has been successfully " + formatStatus(status) + ".");
        }, function (error) {
            console.log(error);
        });
    }

    function nextStep() {
        vm.kycerror = false;
        vm.personalDetailsError = false;
        if (vm.getActiveStep() == 2 && !vm.isBroker) {
            $rootScope.brokerageSubmitted = false;
            const requiredDocuments = vm.documents.filter(function (item) {
                return item.categoryCode == "NRIC_FIN" || item.categoryCode == "INCOME_TAX";
            }).every(function (item) {
                return !!item.documentID;
            });
            if (!requiredDocuments) {
                $mdToast.showSimple('Please upload Income Tax and NRIC Documents before proceeding to next step.');
                return;
            }
        }
        if (vm.getActiveStep() == 3 && !vm.isBroker) {
            $rootScope.mainLoading = true;
            $rootScope.mainLoadingMessage = "Saving Profile details... Please wait."
            UserService.saveProfileFields().then(function (success) {
                $mdToast.showSimple('Personal Details Saved Successfully!');
                $rootScope.$broadcast('updateProgressChart');
                $rootScope.mainLoading = false;
                moveNext();
            }).catch(function (error) {
                $rootScope.mainLoading = false;
                vm.personalDetailsError = true;
                $mdToast.showSimple('Please fill all fields marked *');
                return;
            });
        }
        else if (vm.getActiveStep() == 4 && !vm.isBroker) {
            $rootScope.mainLoading = true;
            $rootScope.mainLoadingMessage = "Saving KYC details... Please wait.";
            $scope.selectedPartners[0]['showCalendar'] = true;
            UserService.saveKYCFields().then(function (success) {
                $mdToast.showSimple('KYC Details Saved Successfully!');
                $rootScope.$broadcast('updateProgressChart');
                $rootScope.mainLoading = false;
                moveNext();
            }).catch(function (error) {
                $rootScope.mainLoading = false;
                $mdToast.showSimple('Please fill all fields marked *');
                vm.kycerror = true;
                return;
            });
        }
        else if (vm.getActiveStep() == 5 && !vm.isBroker) {
            console.log('broadcasted submit brokerage event');
            $rootScope.$broadcast('submitBrokerage');
            return;
        }
        else if (vm.getActiveStep() == 5) {
            var steppers = $mdStepper('stepper-demo');
            steppers.goto(0);
            vm.selectedDocumentNames = [];
            return;
        }
        else moveNext();
    }

    function nextRequestStep() {
        if (vm.getActiveStep() > 1) {
            document.getElementsByClassName('md-stepper-indicator ng-scope')[vm.getActiveStep() - 1].className += " md-completed";
            vm.allVerified = document.getElementsByClassName('md-stepper-indicator ng-scope md-completed').length === 4;
        }
        if (vm.getActiveStep() === 5) {
            var steppers = $mdStepper('stepper-demo');
            steppers.goto(0);
            vm.selectedDocumentNames = [];
            return;
        }
        else moveNext();
    }

    function moveNext() {
        var steppers = $mdStepper('stepper-demo');
        steppers.next();
        $window.scrollTo(0, 0);
        vm.selectedDocumentNames = [];
        return;
    }

    function backStep() {
        if (vm.getActiveStep() == 1) return;
        var steppers = $mdStepper('stepper-demo');
        steppers.back();
        vm.selectedDocumentNames = [];
    }

    function searchText(seacrh_query, search_str) {
        return search_str.indexOf(seacrh_query) > -1;
    }

    function searchAppointment(appointment) {
        var search_str = appointment.fname + " " + appointment.lname;
        return searchText(vm.searchUsername.toLowerCase(), search_str.toLowerCase());
    }

    function changeUsers() {
        vm.userAppointmentsFiltered = vm.userAppointments.filter(searchAppointment);
    }

    function changeBrokerageApplications() {
        vm.filteredContactedBrokers = vm.contactedBrokers.filter(function (item) {
            return searchText(vm.searchBrokerageApplications.toLowerCase(), item.brokerageId.toLowerCase());
        })
    }

    function selectUser(index) {
        CalendarService.fetchBrokerMeetings().then((data) => {
            vm.userSlots = data.filter(function (a) {
                return a.userEmailId === vm.userAppointment.email;
            });
            vm.userSlots.map(function (a) {
                a['startTime'] = moment(a['startTime'], 'DD/MM/YYYY hh:mm').toDate();
            })
        });
        var steppers = $mdStepper('stepper-demo');
        steppers.goto(0);
        vm.allVerified = 0;
        for (let i = 0; i < 5; i++) {
            document.getElementsByClassName('md-stepper-indicator ng-scope')[i].className = document.getElementsByClassName('md-stepper-indicator ng-scope')[i].className.replace(" md-completed", "");
        }
        vm.selectedIndex = index;
        vm.userAppointment = vm.userAppointments[index];
        vm.selectedDocumentNames = [];
        drawCharts();
        const leadingZeros = (number, zeros = 2) => {
            let string = (number || 0) + "";
            while (string.length < zeros) string = "0" + string;
            return string;
        }
        BrokerageResource.validationReports({
            userId: vm.userAppointment.email
        }, (response) => {
            vm.validationReports = response.data.checkList;
            vm.validationAcceptedCount = leadingZeros(vm.validationReports.filter(x => x.status === "PASS").length);
            vm.validationRejectedCount = leadingZeros(vm.validationReports.filter(x => x.status !== "PASS").length);
            vm.validationTotalCount = leadingZeros(vm.validationReports.length);
        });
        $rootScope.loadingProgress = true;
        BrokerageResource.brokeragesDetails({
            'userEmailId': vm.userAppointment.email
        }, function (req) {
            vm.brokeragesDetails = req.data;
            DocumentResource.categories(function (response) {
                $rootScope.loadingProgress = false;
                vm.documents = response.data;
                vm.documents.forEach(function (doc) {
                    doc.documentID = null;
                    doc.replaceAction = false;
                });
                vm.brokeragesDetails.document.forEach(function (existingDoc) {
                    for (var i = 0; i < vm.documents.length; i++) {
                        if (existingDoc.documentType == vm.documents[i].documentType) {
                            vm.documents[i].documentID = existingDoc.documentID;
                            vm.documents[i].documentName = existingDoc.documentName;
                            vm.documents[i].mimeType = existingDoc.mimeType;
                            break;
                        }
                    }
                });
            }, function (error) {});
        }, function () {});
        $rootScope.loadingProgress = true;
        updateMessages();
    }

    function updateMessages() {
        $rootScope.loadingProgress = true;
        vm.usermessages = [];
        BrokerageResource.usermessages({
            userId: vm.userAppointment.email
        }, function (response) {
            $rootScope.loadingProgress = false;
            for (let i = 0; i < response.data.length; i++) {
                const message = response.data[i]['messageContent'];
                //moment(a['startTime'], 'DD/MM/YYYY hh:mm').toDate()
                const messageDate = moment(response.data[i]['messageDate'], 'DD/MM/YYYY hh:mm').format('DD/MM/YYYY');
                // moment(response.data[i]['messageDate'], 'DD/MM/YYYY hh:mm').toDate();
                let className = "";
                if (response.data[i]['messageFrom'] === vm.userAppointment.email) {
                    className = "right";
                }
                else {
                    className = "left";
                }
                vm.usermessages.push({
                    'message': message
                    , 'class': className
                    , 'date': messageDate
                });
            }
        }, function () {});
    }

    function getSelectedUserEmail() {
        return vm.userAppointment.email;
    }

    function toggleShowPartner(index) {
        for (var i = 0; i < $scope.selectedPartners.length; i++) {
            if (i !== index) {
                $scope.selectedPartners[i]['showCalendar'] = false;
            }
            else {
                $scope.selectedPartners[i]['showCalendar'] = !$scope.selectedPartners[i]['showCalendar'];
            }
        }
    }

    function getActiveStep() {
        var steppers = $mdStepper('stepper-demo');
        return steppers.currentStep + 1;
    }

    function addAttachment(file) {
        $rootScope.messageAttachment = file;
        $mdToast.showSimple("Attached file - " + file.name);
    }
    // function removeAttachment(file){
    //     $rootScope.messageAttachment = null;
    // }
    function sendMessage() {
        var messageDict = {
            messageContent: vm.messageReplyText
            , messageSubject: ""
            , messageToEmail: vm.userAppointment.email
            , messageToName: vm.userAppointment.fname + " " + vm.userAppointment.lname
        }
        if (!vm.messageReplyText && !$rootScope.messageAttachment) return;
        MessageService.sendMessage(messageDict, vm.messageReplyText, true).then((response) => {
            if ($rootScope.messageAttachment) vm.upload(response.data.data.messageId);
            vm.messageReplyText = "";
            updateMessages();
            $mdToast.showSimple('Message Successfully Sent!');
        });
    }

    function upload(messageId) {
        console.log("upload started");
        $rootScope.mainLoadingMessage = 'Sending Message... Please Wait.';
        $rootScope.mainLoading = true;
        Upload.upload({
            url: '/kyck-rest/usermessage/upload'
            , data: {
                file: $rootScope.messageAttachment
                , messageId: messageId
            }
        }).then(function (response) {
            $rootScope.mainLoading = false;
            $rootScope.messageAttachment = null;
            $mdToast.show($mdToast.simple().textContent('File Uploaded Successfully!').position('bottom left').toastClass('md-primary'));
        }, function (error) {
            $rootScope.messageAttachment = null;
            $rootScope.mainLoading = false;
            $mdToast.show($mdToast.simple().textContent('File Attachment Failed!').position('bottom right').toastClass('md-warn').hideDelay(2000));
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log(progressPercentage);
        });
    }

    function showRightDrawer() {
        console.log('showRightDrawer');
        $rootScope.rightSideNavCollapsed = !$rootScope.rightSideNavCollapsed;
    }

    function showVideoDialog(slot) {
        $mdDialog.show({
            parent: angular.element(document.body)
            , templateUrl: inviteDialogTemplateUrl
            , controller: InviteDialogController
        });

        function InviteDialogController($scope, $mdDialog) {
            'ngInject';
            $scope.addedEmails = [];
            $scope.closeDialog = function () {
                $rootScope.loadingProgress = true;
                BrokerageResource.getroom({}, {
                    'calendarId': slot.calendarId
                    , 'emailId': $scope.addedEmails
                    , 'userId': vm.userAppointment.email
                }, function (req) {
                    $rootScope.loadingProgress = false;
                    $window.open(req.data, 'Join Video Conferenence', 'width=1024,height=800');
                    $mdToast.showSimple("Invited for Video Conference.")
                }, function (error) {
                    console.log(error);
                });
                $mdDialog.hide();
            }
            $scope.justCloseDialog = function () {
                $mdDialog.hide();
            }
            $scope.addEmail = function () {
                if ($scope.extraEmail != undefined && $scope.extraEmail != "") {
                    $scope.addedEmails.push($scope.extraEmail);
                    $scope.extraEmail = "";
                }
            }
            $scope.removeEmail = function (email) {
                var index = $scope.addedEmails.indexOf(email);
                if (index > -1) $scope.addedEmails.splice(index, 1);
            }
        }
    }
}
export default BrokerageController;