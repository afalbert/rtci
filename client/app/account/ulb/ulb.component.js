'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './ulb.routes';

export class UlbComponent {
  /*@ngInject*/
  constructor($http, $scope,$location) {
    this.message = 'Hello';

    console.log($location.url());
    console.log($location.search());
    $scope.type = $location.search().category;

    $scope.getAssets = function() {
      $http.get('/api/users/getAssets')
          .then(response => {
              console.log(response);
              $scope.rowCollection = response.data;
              $scope.modeCode = _.uniq(_.map(response.data, 'ModeCode'));
              $scope.assetStatus = _.uniq(_.map(response.data, 'AssetStatus'));
              $scope.manufacturer = _.uniq(_.map(response.data, 'Manufacturer'));
              console.log($scope.Status);
          })
          .catch(err => {
              console.log(err);
          })
  }

  $scope.getAssets();
  }

  $onInit(){
    console.log('loading');
  }
}

export default angular.module('rtciApp.ulb', [uiRouter])
  .config(routes)
  .component('ulb', {
    template: require('./ulb.html'),
    controller: UlbComponent,
    controllerAs: 'ulbCtrl'
  })
  .name;
