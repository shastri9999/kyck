'use strict';

import inviteDialogTemplateUrl from './dialog.html';

const d3 = require('d3');
const RadialProgressChart = require('radial-progress-chart');

function BrokerageController($state, $scope, $mdToast,$http, $mdStepper, 
        $mdDialog, $rootScope, BrokerageResource, AuthenticationService, 
        DocumentResource, DashboardResource, UserService, CalendarService, $window, moment) {
    'ngInject';

    var vm = this;
    init();
    function convert(obj) {
        obj['img'] = '/assets/images/partnerLogos/' + obj['brokerageName'] + '.png';
        return obj;
    }
    vm.check = ()=>{
        if(vm.getActiveStep()==1 && vm.isBroker)
        {
            if (!document.querySelector('.chart svg'))
            {
                vm.charts = [];
                drawCharts();                            
            }
        }
    }

    function drawCharts() {
        Promise.all([DashboardResource.profileStatus({userId: vm.userAppointment.email}).$promise,
            DashboardResource.kycStatus({userId: vm.userAppointment.email}).$promise,
            DashboardResource.documentStatus({userId: vm.userAppointment.email}).$promise,
            DashboardResource.validationStatus({userId: vm.userAppointment.email}).$promise
            ]).then((values)=>{
                return values.map(v=>+v.data.percent)
            }).then((values)=>{
                const mappings = [{'name':'profile',
                'solid': '#4bb7f5',
                'background': '#c9e9fc'}, 
                {'name':'kyc', 
                'solid': '#f7b92f',
                'background': '#fde6b2'}, 
                {'name':'document', 
                'solid': '#00ccad',
                'background': '#a6edee'}, 
                {'name':'validation',
                'solid': '#8a88cd',
                'background': '#c9e9ff'}];
                vm.statusValues = values;
                if (!vm.charts || !vm.charts.length)
                {
                    vm.charts = values.map((value, index)=>{
                        const mapping = mappings[index];
                        return new RadialProgressChart('.broker-'+ mapping.name +'-chart', {
                            diameter: 55,
                            shadow: {
                              width: 0
                          },
                          stroke: {
                              width: 6,
                          },
                          animation: {
                              duration: 1
                          },
                          center: function(p){return p + "%";},
                          series: [
                              {
                                value: value,
                                color: {
                                  solid: mapping.solid,
                                  background: mapping.background
                                }
                            }]
                        });
                    });
                }
                else
                {
                    values.forEach((value, index)=>{
                        vm.charts[index].update(value);
                    });
                }
            });
        }

    function init() {
        vm.nextStep = nextStep;
        vm.backStep = backStep;
        vm.nextRequestStep = nextRequestStep;
        vm.selectedIndex = 0;
        vm.getActiveStep = getActiveStep;
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
        vm.changeBrokerageApplications = changeBrokerageApplications;

        $rootScope.loadingProgress = false;

        if (!vm.isBroker)
        {
            $rootScope.loadingProgress = true;
            BrokerageResource.contactedBrokerages((response)=>{
                vm.contactedBrokers = response.data;
                vm.filteredContactedBrokers = vm.contactedBrokers;

                BrokerageResource.brokeragesList((req)=> {
                    $rootScope.loadingProgress = false;
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

            $rootScope.loadingProgress = true;
            DocumentResource.categories(function(response){
                $rootScope.loadingProgress = false;
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

        }

        else {
            $rootScope.sideNavCollapsed = true;
        }

        $rootScope.loadingProgress = true;
        BrokerageResource.userprofileget(function(response){
            $rootScope.loadingProgress = false;
            var questions = response.data;
            vm.questionsmap = {};
            questions.forEach(function(q){
                vm.questionsmap[q.questionDesc] = q;
            });
        }, function(error){
        });

        $rootScope.loadingProgress = true;
        BrokerageResource.kycget(function(response){
            $rootScope.loadingProgress = false;
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
            $rootScope.loadingProgress = true;
            BrokerageResource.userAppointments((response)=>{
                $rootScope.loadingProgress = false;
                vm.userAppointments = response.data;
                vm.userAppointmentsFiltered = vm.userAppointments;
                shuffletheorder();
                vm.userAppointment = vm.userAppointments[0];
                if (vm.userAppointments.length > 0) {
                    selectUser(0);
                }
            });

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
        var currentD = new Date();
        var currentDate = currentD.getDate();
        for(var j=0; j<= 300; ++j)
        {
            //if date is valid else don't execute the for loop
            var day = currentD.getDay() + j;
            if (day % 7 != 6 && day % 7 !=0) {
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
        $rootScope.loadingProgress = true;
        BrokerageResource.updateApplication({"status": status,
                "userId": vm.userAppointment.email},
        function (response) {
            $rootScope.loadingProgress = false;
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

        $rootScope.loadingProgress = true;
        BrokerageResource.updateMeetingStatus({
                "status": status,
                "userId": vm.userAppointment.email
            },
        function (response) {
            $rootScope.loadingProgress = false;
            vm.userSlots = vm.userSlots.map(function(a){
                if (a.userId == vm.userAppointment.email)
                    a.status = "CONFIRM";
                return a;
            });

            vm.userAppointments[vm.selectedIndex]['applicationStatus'] = "APPROVED";

            $mdToast.showSimple("Appointment slot has been successfully "+formatStatus(status)+".");
        }, function (error) {
            console.log(error);
        });
    }

    function showDialog($event) {

        for (var i=0; i<$scope.selectedPartners.length; i++) {
            var partner = $scope.selectedPartners[i];
            console.log('logging', partner.selectedAppointments, !partner.selectedAppointments);

            if (!partner.selectedAppointments) {
                $mdToast.showSimple("No time slot selected for "+partner.brokerageName+". Please select atleast 1 time slot.");
                return;
            }
        }

       var parentEl = angular.element(document.body);
       var partner = (vm.partners.filter(x=>x.selected)[0]);

       var brokerageReqs = [];
       for (var i=0; i<$scope.selectedPartners.length; i++) {
            var partner = $scope.selectedPartners[i];

            var calslots = [];

            if (partner.selectedAppointments) {
                for (var j=0; j<partner.selectedAppointments.length; j++) {
                    calslots.push({
                        "calenderSlot": partner.selectedAppointments[j],
                        "meetingContent": "Meeting about brokerage application",
                        "meetingLocation": "Singapore",
                        "meetingStatus": "PENDING",
                        "meetingSubject": "Discussion about brokerage application"
                    });
                }
            }

            brokerageReqs.push({
                "brokerageId": partner.brokerageId+"",
                "calenderDetails" : calslots
            });
       }

       $rootScope.loadingProgress = true;
       BrokerageResource.submitBrokerageApplication({},{"brokerageCalenderSlot": brokerageReqs}, function(s) {
         $rootScope.loadingProgress = false;
         for (var i=0; i<$scope.selectedPartners.length; i++) {
            $scope.selectedPartners[i].selectedAppointments = [];
         }

         BrokerageResource.contactedBrokerages((response)=>{
            vm.contactedBrokers = response.data;
            BrokerageResource.brokeragesList((req)=> {
                $rootScope.loadingProgress = false;
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
        },
            function (error) {console.log(error)}
        );

       // $mdToast.showSimple("Your appointment preferences have been sent to the partners.");

       $mdDialog.show({
         parent: parentEl,
         targetEvent: $event,
         template:
           '<md-dialog aria-label="List dialog">' +
           '  <md-dialog-content style="width:500px;height:60px;">'+
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
        if (vm.getActiveStep() == 2 && !vm.isBroker) {
            const requiredDocuments = vm.documents.filter(function(item){
                return item.categoryCode == "NRIC_FIN" || item.categoryCode == "INCOME_TAX";
            }).every(function(item){
                return !!item.documentID;
            });
            if (!requiredDocuments)
            {
                $mdToast.showSimple('Please upload Income Tax and NRIC Documents before proceeding to next step.');
                return;
            }
        }
        if (vm.getActiveStep() == 3 && !vm.isBroker) {
            $rootScope.mainLoading = true;
            $rootScope.mainLoadingMessage = "Saving Profile details... Please wait."
            UserService.saveProfileFields().then(function(success){
                 $mdToast.showSimple('Personal Details Saved Successfully!');
                 $rootScope.$broadcast('updateProgressChart');
                 $rootScope.mainLoading = false;
                 moveNext();
                })
            .catch(function(error){
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
            UserService.saveKYCFields().then(function(success){
                 $mdToast.showSimple('KYC Details Saved Successfully!');
                 $rootScope.$broadcast('updateProgressChart');
                $rootScope.mainLoading = false;
                 moveNext();
            })
            .catch(function(error){
                $rootScope.mainLoading = false;
                $mdToast.showSimple('Please fill all fields marked *');
                vm.kycerror = true;
                return;
            });
        }
        else if (vm.getActiveStep() == 5 && !vm.isBroker) {
            showDialog();
            return;
        }
        else if (vm.getActiveStep() == 5) {
            var steppers = $mdStepper('stepper-demo');
            steppers.goto(0);
            vm.selectedDocumentNames = [];
            return;
        }
        else
            moveNext();

    }

    function nextRequestStep() {
        if (vm.getActiveStep() > 1) {
            document.getElementsByClassName('md-stepper-indicator ng-scope')[vm.getActiveStep()-1].className+=" md-completed";
            vm.allVerified = document.getElementsByClassName('md-stepper-indicator ng-scope md-completed').length===4;
        }
        if (vm.getActiveStep() === 5) {
            var steppers = $mdStepper('stepper-demo');
            steppers.goto(0);
            vm.selectedDocumentNames = [];
            return;
        }
        else
            moveNext();
    }

    function moveNext() {
        var steppers = $mdStepper('stepper-demo');
        steppers.next();
        $window.scrollTo(0, 0);
        vm.selectedDocumentNames = [];
        return;
    }

    function backStep() {
        if (vm.getActiveStep() == 1)
            return;

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

    function changeBrokerageApplications() {
        vm.filteredContactedBrokers = vm.contactedBrokers.filter(function(item) {
            return searchText(vm.searchBrokerageApplications.toLowerCase(), item.brokerageId.toLowerCase());
        })
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
                return a.userEmailId === vm.userAppointment.email;
            });
            vm.userSlots.map(function(a) {
                a['startTime'] = moment(a['startTime'], 'DD/MM/YYYY hh:mm').toDate();
            })
        });
        

        var steppers = $mdStepper('stepper-demo');
        steppers.goto(0);
        vm.allVerified = 0;
        vm.selectedIndex=index;
        vm.userAppointment = vm.userAppointments[index];
        vm.selectedDocumentNames = [];

        drawCharts();


        $rootScope.loadingProgress = true;
        BrokerageResource.brokeragesDetails({'userEmailId':vm.userAppointment.email}, function (req) {
            vm.brokeragesDetails = req.data;
            DocumentResource.categories(function(response){
                $rootScope.loadingProgress = false;
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



        $rootScope.loadingProgress = true;
        BrokerageResource.usermessages({userId: vm.userAppointment.email}, function(response) {
            $rootScope.loadingProgress = false;
            for(let i=0; i<response.data.length; i++) {
                const message = response.data[i]['messageContent'];
                const messageDate =  Date.parse(response.data[i]['messageDate']);
                let className = "";
                if (response.data[i]['messageFrom']===vm.userAppointment.email) {
                    className="left";
                }
                else
                {
                    className="right";
                }

                vm.usermessages.push({'message':message, 'class': className, 'date': messageDate});
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
        textContent = "You are booking an appointment on December " + day +" at "+ numToTime(hour) + " . Are you sure?";

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
        for (var i=0; i<$scope.selectedPartners.length; i++) {
            if (i!==index) {
                $scope.selectedPartners[i]['showCalendar'] = false;
            } else {
                $scope.selectedPartners[i]['showCalendar'] = !$scope.selectedPartners[i]['showCalendar'];
            }
        }
    }

    function getActiveStep() {
        var steppers = $mdStepper('stepper-demo');
        return steppers.currentStep + 1;
    }

    function showVideoDialog(slot) {
        $mdDialog.show({
             parent: angular.element(document.body),
             templateUrl: inviteDialogTemplateUrl,
             controller: InviteDialogController
        });

        function InviteDialogController($scope, $mdDialog) {
            'ngInject';
            $scope.addedEmails=[];

            $scope.closeDialog = function() {
                $rootScope.loadingProgress = true;
                BrokerageResource.getroom({},{
                    'calendarId':slot.calendarId,'emailId' : $scope.addedEmails, 'userId' : vm.userAppointment.email
                }, function(req){
                    $rootScope.loadingProgress = false;
                    $window.open(req.data, 'Join Video Conferenence', 'width=1024,height=800');
                    $mdToast.showSimple("Invited for Video Conference.")
                }, function(error){console.log(error);});
                $mdDialog.hide();
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
