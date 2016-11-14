'use strict';

import inviteDialogTemplateUrl from './dialog.html';

function BrokerageController($state, $scope, $mdToast,$http, $mdStepper, 
        $mdDialog, $rootScope, BrokerageResource, AuthenticationService, 
        DocumentResource, UserService, CalendarService, $window, moment) {
    'ngInject';

    var vm = this;
    init();
    function convert(obj) {
        obj['img'] = '/assets/images/partnerLogos/' + obj['brokerageName'] + '.png';
        return obj;
    }

    function init() {
        vm.nextStep = nextStep;
        vm.backStep = backStep;
        vm.nextRequestStep = nextRequestStep;
        vm.selectedIndex = 0;
        vm.activeStep = 1;
        vm.isBroker = $scope.isBroker = AuthenticationService.isBroker();
        vm.selectUser = selectUser;
        vm.getSelectedUserEmail =getSelectedUserEmail;
        $scope.selectedPartners = [];
        vm.timeslotSelected = false;
        vm.kycerror = false;
        vm.personalDetailsError = false;
        vm.submitApplication = submitApplication;
        vm.updateMeetingStatus = updateMeetingStatus;
        vm.showVideoDialog = showVideoDialog;
        vm.usermessages = [];
        vm.selectedDocumentNames = [];
        vm.bgurl = AuthenticationService.getBGURL();
        vm.toggleShowPartner = toggleShowPartner;

        vm.changeUsers = changeUsers;
        if (!vm.isBroker)
        {
            BrokerageResource.contactedBrokerages((response)=>{
                vm.contactedBrokers = response.data;
                BrokerageResource.brokeragesList((req)=> {
                    var brokeragesList = req.data;
                    vm.partners = brokeragesList.map(convert);
                    vm.partners = vm.partners.map((partner)=>{
                        vm.contactedBrokers.forEach((broker)=>{
                            if (broker.brokerageId == partner.brokerageName)
                            {
                                partner.status = broker.status;
                            }
                        });
                        return partner;
                    })
                    vm.premiumPartnersCount = brokeragesList.filter(function(obj){return obj['brokerageCategory']=='PREMIUM'}).length;
                });     
            });  

            DocumentResource.categories(function(response){
                vm.documents = response.data;
                vm.documents.forEach(function(doc){
                    doc.documentID = null;
                    doc.replaceAction = false;
                });
                DocumentResource.findall((response)=>{
                    const documents = response.data;

                   documents.forEach(function(existingDoc){
                        for(var i=0; i<vm.documents.length; i++){
                            if(existingDoc.documentType==vm.documents[i].documentType){
                                vm.documents[i].documentID = existingDoc.documentID;
                                vm.documents[i].documentName = existingDoc.documentName;
                                vm.documents[i].mimeType = existingDoc.mimeType;
                                break;
                            }
                        }
                   });
                });
                
            }, function(error){});

            vm.replace = (document)=>{
                document.replaceAction = true;
            }
        }

        BrokerageResource.userprofileget(function(response){
            var questions = response.data;
            vm.questionsmap = {};
            questions.forEach(function(q){
                vm.questionsmap[q.questionDesc] = q;
            });
        }, function(error){
        });

        BrokerageResource.kycget(function(response){
            var questions = response.data;
            vm.kycquestions = {};
            questions.forEach(function(q){
                vm.kycquestions[q.questionDesc] = q;
            });
        }, function(error){
        });

        vm.toggleSelected = function(partner){
            if (partner.status)
                return;
            partner.selected = !partner.selected;

            if(partner.selected){
                $scope.selectedPartners.push(partner);
            }else{
                $scope.selectedPartners = $scope.selectedPartners.filter(function(obj) {
                    return obj.brokerageId !== partner.brokerageId;
                })
            }

            if ($scope.selectedPartners.length>1) {
                var steppers = $mdStepper('stepper-demo');
            }
        }

        if (vm.isBroker) {
            $rootScope.sideNavCollapsed = true;
            BrokerageResource.userAppointments((response)=>{
                vm.userAppointments = response.data;
                vm.userAppointmentsFiltered = vm.userAppointments;
                shuffletheorder();
                vm.userAppointment = vm.userAppointments[0];
                if (vm.userAppointments.length > 0) {
                    selectUser(0);
                }
            });
        }
        if (vm.isBroker)
        {
            vm.getDownloadLink = ()=>{
                if (vm.userAppointment && vm.selectedDocumentNames.length)
                    return '/kyck-rest/document/bulkDownload?'+ 'userId=' + vm.userAppointment.email + '&documentNames='
                    + vm.selectedDocumentNames.join(',');
                return '';
            }
            vm.toggleAllDocuments = ()=>{
                let selection = [];
                vm.brokeragesDetails.document.forEach((doc)=>{
                    selection.push(doc.documentName);
                });
                if (selection.length == vm.selectedDocumentNames.length)
                {
                    vm.selectedDocumentNames = [];
                }
                else
                {
                    vm.selectedDocumentNames = selection;
                }
            }

            vm.hasDocument = function(document) {
                return (vm.selectedDocumentNames.indexOf(document.documentName) >= 0);
            }

            vm.toggleDocument = function(document){
                const name = document.documentName;
                const index = vm.selectedDocumentNames.indexOf(document.documentName);
                if (index >= 0)
                {
                    vm.selectedDocumentNames.splice(index, 1);
                }
                else
                {
                    vm.selectedDocumentNames.push(document.documentName)
                }
            }

        }


        vm.preview = function(document){
            $rootScope.canEnableOCR = !vm.isBroker;
            $rootScope.showDocumentPreview();
            DocumentResource.metadata({documentType: document.documentType}, function(response){
                const documentData = response.data;
                let document = documentData;
                $rootScope.viewingDocument = document;
                $rootScope.viewingDocument.OCR = null;
                DocumentResource.ocrdata({documentCategory: document.documentType}, function(response){
                    $rootScope.viewingDocument.OCR = response.data;
                });
                $http({
                    method: 'GET',
                    url: '/kyck-rest/document/download/string64',
                    params: {documentId: documentData.documentName},
                    transformResponse: [function (data) {
                          return data;
                      }]
                }).then((data)=>{
                    let URL = 'data:' + documentData.mimeType + ';base64,' + data.data;
                    $rootScope.showDocumentPreview(URL);
                })
            });
        }

        const leadingZeros = (number, zeros=2)=>{
            let string = (number || 0) + "";
            while (string.length < zeros)
                string = "0" + string;
            return string;
        } 
        BrokerageResource.validationReports({
            userId: AuthenticationService.getLoggedInUser().userId
        },(response)=>{
            vm.validationReports = response.data.checkList;
            vm.validationAcceptedCount = leadingZeros(vm.validationReports.filter(x=>x.status==="PASS").length);
            vm.validationRejectedCount = leadingZeros(vm.validationReports.filter(x=>x.status!=="PASS").length);
            vm.validationTotalCount = leadingZeros(vm.validationReports.length);
        });

        var events = [];
        var currentDate = new Date();
        currentDate = currentDate.getDate();
        for(var j=0; j<= 30; ++j)
        {
            for(var i=10; i<=19; ++i)
            {
                var i2 = 1+i;
                events.push({
                    start: getDate(j, i),
                    allDay: true,
                    customClass: 'book-appointment',
                    title: numToTime(i) + ' - ' + numToTime(i2),
                    mday: currentDate + j,
                    mhour: i
                })
            }
        }
        vm.events = events;
        vm.eventClicked = eventClicked;
        vm.eventCreate = eventCreate;
    }

    function numToTime(i) {
        if (i<12)
            return i + ':00 AM';
        else if (i==12)
            return i + ':00 PM';
        else
            return (i-12) + ':00 PM';
    }

    function shuffletheorder() {
        function statusToNum(status) {
            if (status == 'PENDING')
                return 0;
            if (status == 'APPROVED')
                return 1;
            if (status == 'REJECT')
                return 2;
        }

        vm.userAppointments.sort(function(a,b) {
            if (statusToNum(a.applicationStatus) < statusToNum(b.applicationStatus))
                return -1;
            else if (statusToNum(a.applicationStatus) === statusToNum(b.applicationStatus))
                return 0;
            else
                return 1;
        });
    }

    function submitApplication(status) {
        BrokerageResource.updateApplication({"status": status,
                "userId": vm.userAppointment.email},
        function (response) {
            $mdToast.showSimple("Application has been successfully "+status.toLowerCase()+".");
            vm.userAppointment.applicationStatus = status;
            vm.selectedIndex = vm.userAppointments.findIndex(function (a) {return a.email == vm.userAppointment.email;})
            shuffletheorder();
        }, function (error) {
            console.log(error);
        });
    }

    function updateMeetingStatus(status) {
        function formatStatus(status) {
            var t = status.toLowerCase();
            if (t=="CONFIRM")
                return "confirmed";
            if (t=="RESCHEDULE")
                return "rescheduled";
            else
                return t;
        }

        BrokerageResource.updateMeetingStatus({
                // "status": status,
                // "userId": vm.userAppointment.email
            },
        function (response) {
            vm.userSlots = vm.userSlots.map(function(a){
                if (a.userId == vm.userAppointment.email)
                    a.status = "CONFIRM";
                return a;
            });

            vm.userAppointments[vm.selectedIndex]['applicationStatus'] = "APPROVED";

            console.log(vm.userAppointment.email, vm.userAppointments, status);

            $mdToast.showSimple("Appointment slot has been successfully "+formatStatus(status)+".");
        }, function (error) {
            console.log(error);
        });
    }

    function showDialog($event) {
           var parentEl = angular.element(document.body);
           var partner = (vm.partners.filter(x=>x.selected)[0]);

           //$scope.selectedPartners.selectedAppointments
           var slots = [];
           for (var i=0; i<$scope.selectedPartners.length; i++) {
                var partner = $scope.selectedPartners[i];
                if (partner.selectedAppointments) {
                    for (var j=0; j<partner.selectedAppointments; j++) {
                        slots.push({
                            "brokerageId": partner.brokerageId+"",
                            "calenderSlot": partner.selectedAppointments[j],
                            "meetingContent": "Meeting about brokerage application",
                            "meetingLocation": "Singapore",
                            "meetingStatus": "PENDING",
                            "meetingSubject": "Discussion about brokerage application"
                        });
                    }
                }
           }

           $http({
            method: 'POST',
            url: '/kyck-rest/brokerage/submit',
            headers: {
                "Content-Type": "application/json"
            },            
            data:{
              "brokerageCalenderSlot": slots
            }
           }).then((s)=>{
            console.log(s);
             BrokerageResource.contactedBrokerages((response)=>{

                vm.contactedBrokers = response.data;
                BrokerageResource.brokeragesList((req)=> {
                    var brokeragesList = req.data;
                    vm.partners = brokeragesList.map(convert);
                    vm.partners = vm.partners.map((partner)=>{
                        vm.contactedBrokers.forEach((broker)=>{
                            if (broker.brokerageId == partner.brokerageName)
                            {
                                partner.status = broker.status;
                            }
                        });
                        return partner;
                    })
                    vm.premiumPartnersCount = brokeragesList.filter(function(obj){return obj['brokerageCategory']=='PREMIUM'}).length;
                });            
            });
           }).catch(e=>console.log(e));

           // $mdToast.showSimple("Your appointment preferences have been sent to the partners.");

           $mdDialog.show({
             parent: parentEl,
             targetEvent: $event,
             template:
               '<md-dialog aria-label="List dialog">' +
               '  <md-dialog-content style="width:500px;height:200px;">'+
                '<div class="dialog-content-broker">'+ 
                ' Your appointment preferences have been sent to the partners.' +
                ' </div>' + 
               '  </md-dialog-content>' +
               '  <md-dialog-actions>' +
               '    <md-button ng-click="closeDialog()" class="md-primary">' +
               '      Okay!' +
               '    </md-button>' +
               '  </md-dialog-actions>' +
               '</md-dialog>',
             controller: DialogController
               });
          function DialogController($scope, $mdDialog) {
            'ngInject';
            $scope.closeDialog = function() {
                vm.timeslotSelected = false;
                vm.activeStep = 1;
                var steppers = $mdStepper('stepper-demo');
                steppers.goto(0);
                $mdDialog.hide();
                vm.selectedDocumentNames = [];
            }
          }
    }

    function nextStep() {
        vm.kycerror = false;
        vm.personalDetailsError = false;

        if (vm.activeStep == 3 && !vm.isBroker) {
            $rootScope.mainLoading = true;
            $rootScope.mainLoadingMessage = "Saving Profile details... Please wait."
            UserService.saveProfileFields().then(function(success){
                 /* show success pop up move to next */
                 $mdToast.showSimple('Personal Details Saved Successfully!');
                 $rootScope.$broadcast('updateProgressChart');
                 $rootScope.mainLoading = false;
                 moveNext();
                })
            .catch(function(error){
                vm.personalDetailsError = true;
                 $mdToast.showSimple('Please fill all fields marked *');
                /* Validation error dont move to next step */ 
                return;
            });
        }
        
        else if (vm.activeStep == 4 && !vm.isBroker) {
            $rootScope.mainLoading = true;
            $rootScope.mainLoadingMessage = "Saving KYC details... Please wait.";
            $scope.selectedPartners[0]['showCalendar'] = true;
            UserService.saveKYCFields().then(function(success){
                 /* show success pop up move to next */
                 $mdToast.showSimple('KYC Details Saved Successfully!');
                 $rootScope.$broadcast('updateProgressChart');
                $rootScope.mainLoading = false;
                 moveNext();
            })
            .catch(function(error){
                $mdToast.showSimple('Please fill all fields marked *');
                vm.kycerror = true;
                return;
            });
        }
        else if (vm.activeStep == 5 && !vm.isBroker) {
            showDialog();
            return;
        }
        else if (vm.activeStep == 5) {
            vm.activeStep = 1;
            var steppers = $mdStepper('stepper-demo');
            steppers.goto(0);
            vm.activeStep = 1;
            vm.selectedDocumentNames = [];
            return;
        }
        else
            moveNext();

    }

    function nextRequestStep() {
        if (vm.activeStep > 1) {
            document.getElementsByClassName('md-stepper-indicator ng-scope')[vm.activeStep-1].className+=" md-completed";
            vm.allVerified = document.getElementsByClassName('md-stepper-indicator ng-scope md-completed').length===4;
            console.log(document.getElementsByClassName('md-stepper-indicator ng-scope md-completed').length, vm.allVerified);
        }
        if (vm.activeStep == 5) {
            var steppers = $mdStepper('stepper-demo');
            steppers.goto(0);
            vm.activeStep = 1;
            vm.selectedDocumentNames = [];

            return;
        }
        else
            moveNext();
    }

    function moveNext() {
        vm.activeStep +=1;
        var steppers = $mdStepper('stepper-demo');
        steppers.next();
        $window.scrollTo(0, 0);
        // steppers.goto(4); 
        vm.selectedDocumentNames = [];
        return;
    }

    function backStep() {
        if (vm.activeStep == 1)
            return;

        vm.activeStep -=1 ; 
        var steppers = $mdStepper('stepper-demo');
        steppers.back();

        vm.selectedDocumentNames = [];
    }

    function searchText(seacrh_query, search_str) {
        return search_str.indexOf(seacrh_query) > -1;
    }

    function searchAppointment(appointment) {
        var search_str = appointment.fname + " " + appointment.lname;
        return searchText(vm.searchUsername, search_str);
    }

    function changeUsers() {
        vm.userAppointmentsFiltered = vm.userAppointments.filter(searchAppointment);
    }

    function getDate(offsetDays, hour) {
        offsetDays = offsetDays || 0;
        var offset = offsetDays * 24 * 60 * 60 * 1000;
        var date = new Date(new Date().getTime() + offset);
        if (hour) {
            date.setHours(hour);
        }
        date.setMinutes(0);
        return date;
    }

    function selectUser(index) {
        CalendarService.fetchBrokerMeetings().then((data)=>{
            vm.userSlots = data.filter(function(a){
                return a.userId === vm.userAppointment.email;
            });
            console.log(vm.userSlots);
            vm.userSlots.map(function(a) {
                a['startTime'] = moment(a['startTime'], 'DD/MM/YYYY hh:mm').toDate();
            })
        });
        
        vm.activeStep = 1;
        var steppers = $mdStepper('stepper-demo');
        steppers.goto(0);
        vm.allVerified = 0;
        vm.selectedIndex=index;
        vm.userAppointment = vm.userAppointments[index];
        vm.selectedDocumentNames = [];



        BrokerageResource.brokeragesDetails({'userEmailId':vm.userAppointment.email}, function (req) {
            vm.brokeragesDetails = req.data;
            DocumentResource.categories(function(response){
                vm.documents = response.data;
                vm.documents.forEach(function(doc){
                    doc.documentID = null;
                    doc.replaceAction = false;
                });
                vm.brokeragesDetails.document.forEach(function(existingDoc){
                    for(var i=0; i<vm.documents.length; i++){
                        if(existingDoc.documentType==vm.documents[i].documentType){
                            vm.documents[i].documentID = existingDoc.documentID;
                            vm.documents[i].documentName = existingDoc.documentName;
                            vm.documents[i].mimeType = existingDoc.mimeType;
                            break;
                        }
                    }
                });
            }, function(error){});
        }, function () {});



        BrokerageResource.usermessages({userId: vm.userAppointment.email}, function(req) {
            for(var i=0; i<req.data.length; i++) {
                var msg = req.data[i]['messageContent'];
                var messageDate = req.data[i]['messageDate'];
                messageDate = Date.parse(messageDate);
                var c="";
                if (req.data[i]['messageFrom']===vm.userAppointment.email) {
                    c="left";
                }
                else
                    c="right";

                vm.usermessages.push({'msg':msg, 'class': c, 'date': messageDate});
            }
        }, function() {});
    }

    function getSelectedUserEmail(){
        return vm.userAppointment.email;
    }

    function eventClicked($selectedEvent, index) {
        var textContent = "";
        var confirm;

        var closePopup = function() {
            confirm = undefined;
        }
        var day = $selectedEvent.mday;
        var hour = $selectedEvent.mhour;
        vm.selectedDay = day;
        vm.selectedHour = hour;
        vm.selectedTimeSlot = $selectedEvent.start.toISOString();

        textContent = "You are booking an appointment on November " + day +" at "+ numToTime(hour) + " . Are you sure?";

        confirm = $mdDialog.confirm({
            title: 'Book Your Appointment',
            textContent: textContent,
            ok: "Yes",
            cancel: "No"
        });

        $mdDialog
            .show(confirm).then(function() {
            	$mdToast.showSimple('Request for appointment successfully created.');
                if ($scope.selectedPartners[index]['selectedAppointments']) {
                    $scope.selectedPartners[index]['selectedAppointments'].push(vm.selectedTimeSlot);

                    if ($scope.selectedPartners[index]['selectedAppointments'].length >=3) {
                        $scope.selectedPartners[index]['showCalendar'] = false;
                        if (index<$scope.selectedPartners.length-1) {
                            $mdToast.showSimple("3 appointments booked. Moving to next partner.");
                            $scope.selectedPartners[index+1]['showCalendar'] = true;
                        } else {
                            $mdToast.showSimple("3 appointments booked. Click Submit to continue.");
                        }
                    }
                }
                else {
                    $scope.selectedPartners[index]['selectedAppointments']=[vm.selectedTimeSlot];
                }

                vm.timeslotSelected = true;
            }, function() {
            	console.log("NO");
            });
    }

    function eventCreate($date) {
        console.log($date);
    }

    function toggleShowPartner(index) {
        console.log(index);
        for (var i=0; i<$scope.selectedPartners.length; i++) {
            if (i!==index) {
                $scope.selectedPartners[i]['showCalendar'] = false;
            } else {
                console.log(i, index);
                $scope.selectedPartners[i]['showCalendar'] = !$scope.selectedPartners[i]['showCalendar'];
            }
        }
    }

    function showVideoDialog($event) {
        $mdDialog.show({
             parent: angular.element(document.body),
             targetEvent: $event,
             templateUrl: inviteDialogTemplateUrl,
             controller: InviteDialogController
        });

        function InviteDialogController($scope, $mdDialog) {
            'ngInject';
            $scope.addedEmails=[];

            $scope.closeDialog = function() {
                console.log($scope.addedEmails, vm.userAppointment);
                BrokerageResource.startconference({
                    'emailId' : $scope.addedEmails, 'userId' : vm.userAppointment.email
                }, function(req){
                    $window.open(req.data, 'Join Video Conferenence', 'width=1024,height=800');
                    $mdToast.showSimple("Invited for Video Conference.")
                }, function(error){console.log(error);});
                $mdDialog.hide();
                //use $scope.addedEmails & make an API Call
            }
            $scope.addEmail = function() {
                $scope.addedEmails.push($scope.extraEmail);
                $scope.extraEmail = "";
            }
            $scope.removeEmail = function(email) {
                var index = $scope.addedEmails.indexOf(email);
                if (index > -1)
                    $scope.addedEmails.splice(index, 1);
            }
        }
    }

}

export default BrokerageController;
