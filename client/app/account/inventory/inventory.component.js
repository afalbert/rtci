'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './inventory.routes';

export class InventoryComponent {
    /*@ngInject*/
    constructor($http, $scope) {
        this.message = 'Hello';
        this.$http = $http;




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
        $scope.updateTable = function(category) {
            $scope.rowCollection = null;
            $scope.category = category;
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
        this.$scope = $scope;
    }

    $onInit() {


    }

    editAsset(asset) {
        console.log(asset);
        this.updateAsset = asset;
        console.log(this.$scope);
        if (!this.$scope.category) {
            this.updateRevenueAsset = asset;
            $('#editRevenueVehiclesModal').modal();
        } else if (this.$scope.category && this.$scope.category === 'passengerfacilities') {
            this.updatePassengerAsset = asset;
            $('#editpassengerFacilitiesModal').modal();
        } else if (this.$scope.category && this.$scope.category === 'mandafacilities') {
            this.updateMAAsset = asset;
            $('#editadminAndMaintenanceModal').modal();
        } else if (this.$scope.category && this.$scope.category === 'revenuevehicles') {
            this.updateRevenueAsset = asset;
            $('#editRevenueVehiclesModal').modal();
        } else if (this.$scope.category && this.$scope.category === 'nonrevenuevehicles') {
            this.updateNonRevenueAsset = asset;
            $('#editnonRevenueVehiclesModal').modal();
        }

    }



    saveAssetUpdates(category) {
        console.log(this.$scope);
        this.savingAssetSpinner = true;
        console.log(this.updateAsset);
        this.updateAsset.category = category;
        // this.updateAsset = {};

        this.$http.put('/api/users/' + this.updateAsset.AssetUID + '/asset', this.updateAsset)
            .then(response => {
                console.log(response);
                if (response.data.returnValue === 0) {
                    this.$scope.getAssets();

                    $('#editRevenueVehiclesModal').modal('hide');
                    this.savingAssetSpinner = false;
                }
            })
            .catch(err => {
                console.log(err);
            });
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