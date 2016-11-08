'use strict';

function BrokerageController($scope,$mdToast, $mdStepper, $mdDialog, $filter, $log, BrokerageResource, AuthenticationService, DocumentResource, UserService) {
    'ngInject';

    var vm = this;
    init();

    function init() {
        vm.nextStep = nextStep;
        vm.backStep = backStep;
        vm.editForm = editForm;
        vm.selectedIndex = 0;
        vm.activeStep = 1;
        $scope.isBroker = AuthenticationService.isBroker();
        vm.selectUser = selectUser;
        vm.getSelectedUserEmail =getSelectedUserEmail;
        $scope.selectedPartners = new Set();
        vm.timeslotSelected = false;
        vm.kycerror = false;
        vm.personalDetailsError = false;

        vm.changeUsers = changeUsers;

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

        function convert(obj) {
            obj['img'] = '/assets/images/partnerLogos/' + obj['brokerageName'] + '.png';
            return obj;
        }

        BrokerageResource.brokeragesList(function (req) {
            var brokeragesList = req.data;
            vm.partners = brokeragesList.map(convert);
            vm.premiumPartnersCount = brokeragesList.filter(function(obj){return obj['brokerageCategory']=='PREMIUM'}).length;
        }, function () {});

        BrokerageResource.userAppointments((response)=>{
            vm.userAppointments = response.data;
            vm.userAppointmentsFiltered = vm.userAppointments;
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
        for(var i=0; i<=24; ++i)
        {
            for(var j=9; j<=17; ++j)
            {
                events.push({
                    start: getDate(i, j),
                    allDay: true,
                    customClass: 'book-appointment',
                    title: 'Slot - ' + (j-8),
                    mday: 7 + i,
                    mhour: j

                })
            }
        }
        vm.events = events;
        vm.eventClicked = eventClicked;
        vm.eventCreate = eventCreate;
    }

    function nextStep() {
        vm.kycerror = false;
        vm.personalDetailsError = false;

        if (vm.activeStep == 3 && !vm.isBroker) {
            UserService.saveProfileFields().then(function(success){
                 /* show success pop up move to next */
                 $mdToast.showSimple('Personal Details Saved Successfully!');
                 moveNext();
                })
            .catch(function(error){
                vm.personalDetailsError = true;
                 $mdToast.showSimple('Please fill all fields marked *');
                /* Validation error dont move to next step */ 
                return;
            });
        }
        
        else if (vm.activeStep == 4) {
            UserService.saveKYCFields().then(function(success){
                 /* show success pop up move to next */
                 $mdToast.showSimple('KYC Details Saved Successfully!');
                 moveNext();
            })
            .catch(function(error){
                $mdToast.showSimple('Please fill all fields marked *');
                vm.kycerror = true;
                return;
            });
        }
        else if (vm.activeStep == 5) {
            var steppers = $mdStepper('stepper-demo');
            steppers.goto(0);
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

    function editForm() {
    	var steppers = $mdStepper('stepper-demo');
    	steppers.goto(0);
    }

    function searchText(seacrh_query, search_str) {
        return search_str.indexOf(seacrh_query) > -1;
    }

    function searchAppointment(appointment) {
        var search_str = appointment.fname + " " + appointment.lname;
        return searchText(vm.searchUsername, search_str);
    }

    function changeUsers() {
        console.log(vm.searchUsername);
        vm.userAppointmentsFiltered = vm.userAppointments.filter(searchAppointment);
        console.log(vm.userAppointmentsFiltered);
    }

    function getDate(offsetDays, hour) {
        offsetDays = offsetDays || 0;
        var offset = offsetDays * 24 * 60 * 60 * 1000;
        var date = new Date(new Date().getTime() + offset);
        if (hour) {
            date.setHours(hour);
        }
        return date;
    }

    function selectUser(index) {
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
