'use strict';

class SelectFormController {
	constructor($rootScope, BrokerageResource, $mdDialog, $mdToast,  $mdStepper, CalendarService, moment) {
		'ngInject';
        var currentD = new Date();
        var currentDate = currentD.getDate();
        var vm = this;

		vm.events = [];
	    function numToTime(i) {
	        if (i<12)
	            return i + ':00 AM';
	        else if (i==12)
	            return i + ':00 PM';
	        else
	            return (i-12) + ':00 PM';
	    }
	
	    function convert(obj) {
	        obj['img'] = '/assets/images/partnerLogos/' + obj['brokerageName'] + '.png';
	        return obj;
	    }
	    
	    function toggleShowPartner(index) {
	        for (var i=0; i<this.selectedPartners.length; i++) {
	            if (i!==index) {
	                this.selectedPartners[i]['showCalendar'] = false;
	            } else {
	                this.selectedPartners[i]['showCalendar'] = !this.selectedPartners[i]['showCalendar'];
	            }
	        }
	    }

	    vm.toggleShowPartner = toggleShowPartner;
	    
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

	    // CalendarService.fetchBrokerMeetings().then((data)=>{
     //        var userSlots = data.map(
     //        	function(a) {
     //        		return moment(a['startTime'], 'DD/MM/YYYY hh:mm').toDate();
     //        	}
     //        );

            for(var j=0; j<= 300; ++j)
	        {
	            //if date is valid else don't execute the for loop
	            var day = currentD.getDay() + j;
	            if (day % 7 != 6 && day % 7 !=0) {
	                for(var i=10; i<=19; ++i) {
	                    var i2 = 1+i;
						var startD = getDate(j, i);
	                    vm.events.push({
	                        start: startD,
	                        allDay: true,
	                        customClass: 'book-appointment',
	                        customText: 'slots',
	                        title: numToTime(i) + ' - ' + numToTime(i2),
	                        mday: startD.getDay(),
	                        mhour: startD.getHours(),
	                        mmonth: startD.getMonth()
	                    });
	                }
	            }
	 		}

	 		// for (var j=0; j<userSlots.length; j++) {
	 		// 	vm.events = vm.events.filter(function (a) {
		 	// 		console.log(userSlots[j].getHours(), a['mhour']);
	 		// 		return !userSlots[j].getHours() == a['mhour'];
	 		// // 		!(
	   //          		// (userSlots[j].getDay() == a['mday']) && 
	   // //          		(userSlots[j].getMonth() == a['mmonth']) &&
	   //          		// (userSlots[j].getHours() == a['mhour'])
    // //         		)
	 		// 	});
	 		// }
        // });

        vm.eventClicked = eventClicked;
	
	    function eventClicked($selectedEvent, index) {
	        var textContent = "";
	        var confirm;

	        var closePopup = function() {
	            confirm = undefined;
	        }

	        function getMonth(num) {
	        	if (num==0)
	        		return "January";
	        	else if (num==1)
	        		return "February";
	        	else if (num==2)
	        		return "March";
	        	else if (num==3)
	        		return "April"
				else if (num==4)
					return "May";
				else if (num==5)
					return "June";
				else if (num==6)
					return "July";
				else if (num==7)
					return "August";
				else if (num==8)
					return "September";
				else if (num==9)
					return "October";
				else if (num==10)
					return "November";
				else if (num==11)
					return "December";
	        }

	        var day = $selectedEvent.mday;
	        var hour = $selectedEvent.mhour;
	        vm.selectedDay = day;
	        vm.selectedHour = hour;
	        vm.selectedTimeSlot = $selectedEvent.start.toISOString();
	        console.log($selectedEvent, $selectedEvent.start.getDay());
	        textContent = "You are booking an appointment on "+getMonth($selectedEvent.start.getMonth()) + " " + $selectedEvent.start.getDay() +" at "+ numToTime(hour) + " . Are you sure?";

	        confirm = $mdDialog.confirm({
	            title: 'Book Your Appointment',
	            textContent: textContent,
	            ok: "Yes",
	            cancel: "No"
	        });

	        $mdDialog
	            .show(confirm).then(function() {
	            	$mdToast.showSimple('Request for appointment successfully created.');
	                if (vm.selectedPartners[index]['selectedAppointments']) {

	                    if (vm.selectedPartners[index]['selectedAppointments'].length >=3) {
	                        vm.selectedPartners[index]['showCalendar'] = false;
	                        if (index<vm.selectedPartners.length-1) {
	                            $mdToast.showSimple("3 appointments booked. Moving to next partner.");
	                            vm.selectedPartners[index+1]['showCalendar'] = true;
	                        } else {
	                            $mdToast.showSimple("3 appointments booked. Click Submit to continue.");
	                        }
	                    }
	                    else {
	                    	vm.selectedPartners[index]['selectedAppointments'].push(vm.selectedTimeSlot);
	                    }
	                }
	                else {
	                    vm.selectedPartners[index]['selectedAppointments']=[vm.selectedTimeSlot];
	                }

	                vm.timeslotSelected = true;
	                $rootScope.$broadcast('timeslotSelected', vm.selectedPartners); 
	            }, function() {
	            	console.log("NO");
	            });

	        $rootScope.$on('submitBrokerage', function($event, e) {
		        for (var i=0; i<vm.selectedPartners.length; i++) {
		            var partner = vm.selectedPartners[i];
		            if (!partner.selectedAppointments) {
		                $mdToast.showSimple("No time slot selected for "+partner.brokerageName+". Please select atleast 1 time slot.");
		                return;
		            }
		        }

		       var parentEl = angular.element(document.body);

		       var brokerageReqs = [];
		       for (var i=0; i<vm.selectedPartners.length; i++) {
		            var partner = vm.selectedPartners[i];

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
		         $rootScope.$broadcast('brokerageSubmitted'); 
		        },
		            function (error) {console.log(error)}
		        );

		       if (!vm.dialogShown) 
		       {
		       	   vm.dialogShown = true;
			       $mdDialog.show({
			         parent: parentEl,
			         targetEvent: $event,
			         template:
			           '<md-dialog aria-label="List dialog">' +
			           '  <md-dialog-content style="width:500px; max-width: 90%; min-height:60px;">'+
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
		      }

		      function DialogController($scope, $mdDialog) {
		        'ngInject';
		        $scope.closeDialog = function() {
		            vm.timeslotSelected = false;
		            vm.dialogShown = false;
		            var steppers = $mdStepper('stepper-demo');
		            steppers.goto(0);
		            $mdDialog.hide();
		            vm.selectedDocumentNames = [];
		            // window.location.reload();
		        }
		      }
	      });
	    }
	}
}

export default SelectFormController;