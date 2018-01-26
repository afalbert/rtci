'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './myaccount.routes';

export class MyaccountComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
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
