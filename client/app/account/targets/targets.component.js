'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './targets.routes';

export class TargetsComponent {
  /*@ngInject*/
  constructor($http, $scope) {
    this.message = 'Hello';
    this.$http = $http;

    $scope.showInfoWindow = false;

    $scope.showInfo = function(){
    $scope.showInfoWindow = true;
    $("#showInfo").alert();
   
    };

    $scope.hideInfo = function(){
      $scope.showInfoWindow = false;
      console.log('clicked');
     
      };

  

    $scope.getTargetsPaoul = function (type) {
      $http.get('/api/users/targets/paoul')
        .then(response => {
          console.log(response);
          $scope.rowCollection = response.data;

        })
        .catch(err => {
          console.log(err);
        })
    }

    $scope.getTargetsPaoul();

    $scope.saveTarget = function(row){
      console.log($scope.target);
      console.log(row);
    }
  }

  $onInit(){
    console.log(this.message);
  }

  
}

export default angular.module('rtciApp.targets', [uiRouter])
  .config(routes)
  .component('targets', {
    template: require('./targets.html'),
    controller: TargetsComponent,
    controllerAs: 'targetsCtrl'
  })
  .name;
