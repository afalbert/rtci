'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './myaccount.routes';

export class MyaccountComponent {
    /*@ngInject*/
    constructor(Auth) {
        this.message = 'Hello';
        this.isLoggedIn = Auth.isLoggedInSync;
        this.isAdmin = Auth.isAdminSync;
        this.getCurrentUser = Auth.getCurrentUserSync;

        this.user = this.getCurrentUser();
        console.log(this.user);
    }

    updateUser(user) {
        console.log(this.user);
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