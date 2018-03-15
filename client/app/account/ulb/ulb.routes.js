'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('ulb', {
      url: '/ulb',
      template: '<ulb></ulb>'
    });
}
