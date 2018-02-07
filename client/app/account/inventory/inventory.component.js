'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './inventory.routes';

export class InventoryComponent {
  /*@ngInject*/
  constructor($http,$scope) {
    this.message = 'Hello';
    // this.$http = $http;
    $scope.test = 'testing';
 
    console.log($scope.test);

    var
    nameList = ['Pierre', 'Pol', 'Jacques', 'Robert', 'Elisa'],
    familyName = ['Dupont', 'Germain', 'Delcourt', 'bjip', 'Menez'];

function createRandomItem() {
    var
        firstName = nameList[Math.floor(Math.random() * 4)],
        lastName = familyName[Math.floor(Math.random() * 4)],
        age = Math.floor(Math.random() * 100),
        email = firstName + lastName + '@whatever.com',
        balance = Math.random() * 3000;

    return{
        firstName: firstName,
        lastName: lastName,
        age: age,
        email: email,
        balance: balance
    };
}

$scope.itemsByPage=15;

// $scope.rowCollection = [];
// for (var j = 0; j < 200; j++) {
//     $scope.rowCollection.push(createRandomItem());
// }

$http.get('/api/users/getAssets')
.then(response => {
  console.log(response);
  $scope.rowCollection = response.data;
})
.catch(err => {
  console.log(err);
})

    // this.rowCollection = [{
    //     firstName: 'Laurent',
    //     lastName: 'Renard',
    //     birthDate: new Date('1987-05-21'),
    //     balance: 102,
    //     email: 'whatever@gmail.com'
    //   },
    //   {
    //     firstName: 'Blandine',
    //     lastName: 'Faivre',
    //     birthDate: new Date('1987-04-25'),
    //     balance: -2323.22,
    //     email: 'oufblandou@gmail.com'
    //   },
    //   {
    //     firstName: 'Francoise',
    //     lastName: 'Frere',
    //     birthDate: new Date('1955-08-27'),
    //     balance: 42343,
    //     email: 'raymondef@gmail.com'
    //   }
    // ];

  }

  $onInit() {




    
    
    // this.$http.get('/api/users/getAssets')
    //   .then(response => {
    //     console.log(response);
    //     this.rowCollection = response.data;
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   })
  }
}

export default angular.module('rtciApp.inventory', [uiRouter])
  .config(routes)
  .component('inventory', {
    template: require('./inventory.html'),
    controller: InventoryComponent,
    controllerAs: 'inventoryCtrl'
  })
  .directive('pageSelect', function() {
    return {
      restrict: 'E',
      template: '<input type="text" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)">',
      link: function(scope, element, attrs) {
          scope.$watch('currentPage', function(c) {
              scope.inputPage = c;
          });
      }
  };
  })

  .name;
