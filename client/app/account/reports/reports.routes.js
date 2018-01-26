'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('reports', {
      url: '/reports',
      template: '<reports></reports>'
    });
}
