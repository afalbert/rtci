'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './myaccount.routes';

export class MyaccountComponent {
    /*@ngInject*/
    constructor(Auth, $http) {
        this.message = 'Hello';
        this.isLoggedIn = Auth.isLoggedInSync;
        this.isAdmin = Auth.isAdminSync;
        this.getCurrentUser = Auth.getCurrentUserSync;
        this.$http = $http;
        this.accountSuccess = false;

        this.user = this.getCurrentUser();
        console.log(this.user);
    }

    updateUser(user) {
        this.accountSuccess = false;
        console.log(this.user);
        this.$http.put('/api/users/' + this.user._id + '/account', this.user)
            .then(response => {
                console.log(response);
                this.accountSuccess = true;
            })
            .catch(err => {
                console.log(err);
            });
    }

    updateUserPwd(user) {
        this.pwdSuccess = false;
        console.log(this.pwd);
        this.$http.put('/api/users/' + this.user._id + '/password', this.pwd)
            .then(response => {
                console.log(response);
                this.pwdSuccess = true;
                this.pwd = {};
            })
            .catch(err => {
                console.log(err);
            });
    }
}

export default angular.module('rtciApp.myaccount', [uiRouter])
    .config(routes)
    .component('myaccount', {
        template: require('./myaccount.html'),
        controller: MyaccountComponent,
        controllerAs: 'myaccountCtrl'
    })
    .name;