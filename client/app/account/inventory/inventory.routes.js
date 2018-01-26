'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('inventory', {
      url: '/inventory',
      template: '<inventory></inventory>'
    });
}
