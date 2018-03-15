'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('targets', {
      url: '/targets',
      template: '<targets></targets>',
      authenticate: true
    });
}
