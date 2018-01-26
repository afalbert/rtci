'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './feedback.routes';

export class FeedbackComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('rtciApp.feedback', [uiRouter])
  .config(routes)
  .component('feedback', {
    template: require('./feedback.html'),
    controller: FeedbackComponent,
    controllerAs: 'feedbackCtrl'
  })
  .name;
