'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './inventory.routes';

export class InventoryComponent {
    /*@ngInject*/
    constructor($http, $scope) {
        this.message = 'Hello';


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

        $scope.updateTable = function(category) {
            $scope.rowCollection = null;
            console.log(category);
            if (category === 'passengerfacilities') {
                $scope.type = ': Passenger Facilites';
            } else if (category === 'mandafacilities') {
                $scope.type = ': M&A Facilities';
            } else if (category === 'revenuevehicles') {
                $scope.type = ': Revenue Vehicles';
            } else if (category === 'nonrevenuevehicles') {
                $scope.type = ': Non Revenue Vehicles';
            }
            // $scope.type = ': ' + category;

            $http.get('/api/users/getAssets/' + category)
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
        };

    }

    $onInit() {


    }

    editAsset(asset) {
        console.log(asset);
        this.updateAsset = asset;
        $('#editRevenueVehiclesModal').modal();
    }

    saveAssetUpdates() {
        console.log(this.updateAsset);
        this.updateAsset = {};
        $('#editRevenueVehiclesModal').modal('hide');
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
    .directive("stResetSearch", function() {
        return {
            restrict: 'EA',
            require: '^stTable',
            link: function(scope, element, attrs, ctrl) {
                return element.bind('click', function() {
                    return scope.$apply(function() {
                        var tableState;
                        tableState = ctrl.tableState();
                        tableState.search.predicateObject = {};
                        tableState.pagination.start = 0;
                        return ctrl.pipe();
                    });
                });
            }
        };
    })

.name;