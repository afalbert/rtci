'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './reports.routes';

export class ReportsComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('rtciApp.reports', [uiRouter])
  .config(routes)
  .component('reports', {
    template: require('./reports.html'),
    controller: ReportsComponent,
    controllerAs: 'reportsCtrl'
  })
  .name;
