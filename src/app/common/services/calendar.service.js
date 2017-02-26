'use strict';
class CalendarService {
    constructor($http, AppConstants, $rootScope) {
        'ngInject';
        this._$http = $http;
        this._$rootScope = $rootScope;
        this.URL = AppConstants.URL;
        this.slots = [];
        this.meetings = [];
    }
    fetchMeetings() {
        this._$rootScope.loadingProgress = true;
        return this._$http({
            method: 'GET'
            , url: this.URL + '/calender/get/latestuserappointments'
        , }).then((response) => {
            this._$rootScope.loadingProgress = false;
            this.slots = response.data.data;
            return this.slots || [];
        });
    }
    fetchMeetingsMonthWise(month, year) {
        this._$rootScope.loadingProgress = true;
        return this._$http({
            method: 'GET'
            , url: this.URL + '/calender/get/userappointments?month=' + month + '&year=' + year
        , }).then((response) => {
            this._$rootScope.loadingProgress = false;
            this.slots = response.data.data;
            return this.slots || [];
        })
    }
    fetchBrokerMeetingsMonthWise(month, year) {
        this._$rootScope.loadingProgress = true;
        return this._$http({
            method: 'GET'
            , url: this.URL + '/calender/get/brokerappointments?month=' + month + '&year=' + year
        , }).then((response) => {
            this._$rootScope.loadingProgress = false;
            this.slots = response.data.data;
            return this.slots || [];
        })
    }
    fetchBrokerMeetings() {
        this._$rootScope.loadingProgress = true;
        return this._$http({
            method: 'GET'
            , url: this.URL + '/calender/get/latestbrokerappointments'
        , }).then((response) => {
            this._$rootScope.loadingProgress = false;
            this.meetings = response.data.data;
            return this.meetings;
        });
    }
    updateAppointmentStatus(calendarDetailRequest) {
        console.log(calendarDetailRequest);
        this._$rootScope.loadingProgress = true;
        return this._$http({
            method: 'POST'
            , url: this.URL + '/calendar/update/appointmentstatus'
            , data: calendarDetailRequest
        }).then((response) => {
            this._$rootScope.loadingProgress = false;
            return response.data;
        })
    }
    updateAppointmentEvent(calendarDetailRequest) {
        this._$rootScope.loadingProgress = true;
        return this._$http({
            method: 'POST'
            , url: this.URL + '/calendar/update/appointmentevent'
            , data: calendarDetailRequest
        }).then((response) => {
            this._$rootScope.loadingProgress = false;
            return response.data;
        })
    }
}
export default CalendarService;