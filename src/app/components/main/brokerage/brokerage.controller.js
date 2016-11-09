'use strict';

function BrokerageController($state, $scope,$mdToast,$http, $mdStepper, $mdDialog, $filter, $log, $rootScope, BrokerageResource, AuthenticationService, DocumentResource, UserService, CalendarService) {
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
        $scope.selectedPartners = new Set();
        vm.timeslotSelected = false;
        vm.kycerror = false;
        vm.personalDetailsError = false;
        vm.submitApplication = submitApplication;
        vm.updateMeetingStatus = updateMeetingStatus;

        vm.changeUsers = changeUsers;
        if (!$scope.isBroker)
        {
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

        }
        BrokerageResource.userprofileget(function(response){
            var questions = response.data;
            vm.questionsmap = {};
            questions.forEach(function(q){
                vm.questionsmap[q.questionDesc] = q;
            });
            $log.info(vm.questionsmap);
        }, function(error){
            $log.error(error);
        });

        BrokerageResource.kycget(function(response){
            var questions = response.data;
            vm.kycquestions = {};
            questions.forEach(function(q){
                vm.kycquestions[q.questionDesc] = q;
            });
            $log.info(vm.kycquestions);
        }, function(error){
            $log.error(error);
        });

        vm.toggleSelected = function(partner){
            if (partner.status)
                return;
            partner.selected = !partner.selected;
            if(partner.selected){
                $scope.selectedPartners.add(partner.title);
            }else{
                $scope.selectedPartners.delete(partner.title);
            }
        }

		BrokerageResource.brokeragesDetails({'userEmailId':AuthenticationService.getLoggedInUser().userId}, function (req) {
            vm.brokeragesDetails = req.data;
        }, function () {});


        BrokerageResource.userAppointments((response)=>{
            vm.userAppointments = response.data;
            vm.userAppointmentsFiltered = vm.userAppointments;
            shuffletheorder();
            vm.userAppointment = vm.userAppointments[0];
            if (vm.userAppointments.length > 0) {
                selectUser(0);
            }
        });

        DocumentResource.categories(function(response){
                $log.debug(response);
                vm.documents = response.data;
                vm.documents.forEach(function(doc){
                    doc.documentID = null; //Making default docId as null. Replacing it with actual value in next call
                    doc.replaceAction = false;
                });
                DocumentResource.findall(function(response){
                    if(response && response.data){
                        response.data.forEach(function(existingDoc){
                            for(var i=0; i<vm.documents.length; i++){
                                if(existingDoc.documentType==vm.documents[i].documentType){
                                    vm.documents[i].documentID = existingDoc.documentID;
                                    break;
                                }
                            }
                        });
                    }
                    $log.debug(vm.documents);
                })
        }, function(error){
                $log.error(error);
        });

        vm.replace = function(document){
            document.replaceAction = true;
        }
        
        vm.preview = function(document){
            $rootScope.showDocumentPreview();
            DocumentResource.metadata({documentType: document.documentType}, function(response){
                var name = response.data["documentName"];
                var mimeType = response.data["mimeType"];
                $http({
                    method: 'GET',
                    url: '/kyck-rest/document/download/string64',
                    params: {documentId: name},
                    transformResponse: [function (data) {
                          return data;
                      }]
                }).then((data)=>{
                    let URL = 'data:' + mimeType + ';base64,' + data.data;
                    $rootScope.showDocumentPreview(URL);
                })
            });
        }


        var validationReports = [
            {
            title: 'Document Type Check',
            description: '',
            ticked: true
            },{
            title: 'Required Fields Check',
            description: '',
            ticked: true
            },{
            title: 'Barcode Check',
            description: '',
            ticked: true
            },{
            title: 'Expiry Date Check',
            description: '',
            ticked: true
            },{
            title: 'Icnumber Checksum Check',
            description: '',
            ticked: false
            },{
            title: 'Name Crosscheck',
            description: '',
            ticked: true
            },{
            title: 'Gender Crosscheck',
            description: '',
            ticked: false
            },{
            title: 'Address Crosscheck',
            description: '',
            ticked: true
            },{
            title: 'Icnumber Crosscheck',
            description: '',
            ticked: true
            },{
            title: 'Nationality Crosscheck',
            description: '',
            ticked: false
            },{
            title: 'Image modification check',
            description: '',
            ticked: true
            },{
            title: 'Hologram modification check',
            description: '',
            ticked: true
            },{
            title: 'Field modification check',
            description: '',
            ticked: true
            },{
            title: 'Tampering Check',
            description: '',
            ticked: true
            },{
            title: 'Photo Tampering Check',
            description: '',
            ticked: true
            },{
            title: 'Photo Crosscheck',
            description: '',
            ticked: true
            },{
            title: 'MRZ Code Check',
            description: '',
            ticked: true
            }
        ];

        vm.validationReports = validationReports;

        var events = [];
        var currentDate = new Date();
        currentDate = currentDate.getDate();
        for(var i=0; i<=24; ++i)
        {
            for(var j=currentDate; j<= (30-currentDate); ++j)
            {
                events.push({
                    start: getDate(i, j),
                    allDay: true,
                    customClass: 'book-appointment',
                    title: 'Slot - ' + (j-8),
                    mday: currentDate + i,
                    mhour: j

                })
            }
        }
        vm.events = events;
        vm.eventClicked = eventClicked;
        vm.eventCreate = eventCreate;
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

        BrokerageResource.updateMeetingStatus({"status": status,
                "userId": vm.userAppointment.email},
        function (response) {
            $mdToast.showSimple("Appointment slot has been successfully "+formatStatus(status)+".");
        }, function (error) {
            console.log(error);
        });
    }

    function showDialog($event) {
           var parentEl = angular.element(document.body);
           var partner = (vm.partners.filter(x=>x.selected)[0]);
           $http({
            method: 'POST',
            url: '/kyck-rest/brokerage/submit',
            headers: {
                "Content-Type": "application/json"
            },            
            data:{
              "brokerageCalenderSlot": [{
                "brokerageId": partner.brokerageId+"",
                "calenderSlot": vm.selectedTimeSlot,
                "meetingContent": "Meeting about brokerage application",
                "meetingLocation": "Singapore",
                "meetingStatus": "PENDING",
                "meetingSubject": "Discussion about brokerage application "
              }]
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
           $mdDialog.show({
             parent: parentEl,
             targetEvent: $event,
             template:
               '<md-dialog aria-label="List dialog">' +
               '  <md-dialog-content style="width:500px;height:400px;">'+
                '<div class="dialog-content-broker">'+ 
                ' You have submitted application and scheduled meeting with '+ partner.brokerageName +
                ' on November ' + vm.selectedDay + ' at ' + vm.selectedHour + ':00.' +
                ' </div>' + 
               '  </md-dialog-content>' +
               '  <md-dialog-actions>' +
               '    <md-button ng-click="closeDialog()" class="md-primary">' +
               '      Close Dialog' +
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
            $rootScope.mainLoadingMessage = "Saving KYC details... Please wait."
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
            return;
        }
        else
            moveNext();
    }

    function moveNext() {
        vm.activeStep +=1; 
        var steppers = $mdStepper('stepper-demo');
        steppers.next();
        return;
    }

    function backStep() {
        if (vm.activeStep == 1)
            return;

        vm.activeStep -=1 ; 
        var steppers = $mdStepper('stepper-demo');
        steppers.back();
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
            //startTime
            //status
            //
        });
        vm.activeStep = 1;
        vm.allVerified = 0;
        vm.selectedIndex=index;
        vm.userAppointment = vm.userAppointments[index];
    }

    function getSelectedUserEmail(){
        return vm.userAppointment.email;
    }

    function eventClicked($selectedEvent) {
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

        textContent = "You are booking an appointment on November " + day +" at "+ hour + ":00 . Are you sure?";

        confirm = $mdDialog.confirm({
            title: 'Book Your Appointment',
            textContent: textContent,
            ok: "Yes",
            cancel: "No"
        });

        $mdDialog
            .show(confirm).then(function() {
            	$mdToast.showSimple('Schedule successfully created');
                vm.timeslotSelected = true;
            }, function() {
            	console.log("NO");
            });
    }

    function eventCreate($date) {
        console.log($date);
    }

}

export default BrokerageController;
