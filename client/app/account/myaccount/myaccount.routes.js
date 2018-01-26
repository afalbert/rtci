'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('myaccount', {
      url: '/myaccount',
      template: '<myaccount></myaccount>'
    });
}
