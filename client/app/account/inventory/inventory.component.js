'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './inventory.routes';

export class InventoryComponent {
  /*@ngInject*/
  constructor($http, $scope) {
    this.message = 'Hello';
    this.$http = $http;

    $scope.bulkIds = [];
    $scope.assets = [];
    $scope.numOfBulkAssets = 0;
    this.updateRevenueAsset = {};

    this.priorityStatus = [1,2,3,4];
    this.manufacturerCodes = manufacturerCodes;
   
   
    $scope.getAssets = function () {
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
    $scope.updateTable = function (category) {
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

    $scope.selectAll = function(){
        $scope.bulkIds = [];
        console.log($scope);
        $scope.displayedCollection.forEach(element => {
            var asset = element;
           $scope.bulkIds.push(asset.AssetUID);
           asset.isChecked = true;
           asset.isSelected = true;
           
            // $scope.bulkIds.forEach(element => {
            //     var assetid = element;
            //     if(assetid === asset.AssetUID){
            //      //    console.log(asset.AssetUID);
            //         asset.isSelected = false;
            //         asset.isChecked = false;
            //         $scope.numOfBulkAssets = 0;
            //         $scope.bulkIds.splice($scope.bulkIds.indexOf(assetid),1);
            //     }
            // });
 
         //    $scope.bulkIds = [];
            
        });

        $scope.numOfBulkAssets = $scope.bulkIds.length;
    }
   $scope.unselectAllAssets = function(){
       $scope.rowCollection.forEach(element => {
           var asset = element;
           $scope.bulkIds.forEach(element => {
               var assetid = element;
               if(assetid === asset.AssetUID){
                //    console.log(asset.AssetUID);
                   asset.isSelected = false;
                   asset.isChecked = false;
                   $scope.numOfBulkAssets = 0;
                   $scope.bulkIds.splice($scope.bulkIds.indexOf(assetid),1);
               }
           });

        //    $scope.bulkIds = [];
           
       });
   }
    $scope.updateBulkIds = function (asset) {
      // console.log(this);
      // console.log(id);
      console.log(asset.isChecked);
      var exists = $scope.bulkIds.indexOf(asset.AssetUID);
      if (exists > -1) {
        console.log('exists');
        $scope.bulkIds.splice(exists, 1);
        asset.isSelected = false;
        // asset.isChecked = false;
      } else {
        console.log('doesnt exist');
        $scope.bulkIds.push(asset.AssetUID);
        asset.isSelected = true;
      }

      console.log($scope.bulkIds);
      $scope.numOfBulkAssets = $scope.bulkIds.length;
    }
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
      console.log(this.updateRevenueAsset.PriorityStatus);
      $('#editRevenueVehiclesModal').modal();
    } else if (this.$scope.category && this.$scope.category === 'passengerfacilities') {
      this.updatePassengerAsset = asset;
      $('#editpassengerFacilitiesModal').modal();
    } else if (this.$scope.category && this.$scope.category === 'mandafacilities') {
      this.updateMAAsset = asset;
      $('#editAdditionalModeSupportinAndMaintenanceModal').modal();
    } else if (this.$scope.category && this.$scope.category === 'revenuevehicles') {
      this.updateRevenueAsset = asset;
      console.log(this.updateRevenueAsset.PriorityStatus);
      $('#editRevenueVehiclesModal').modal();
    } else if (this.$scope.category && this.$scope.category === 'nonrevenuevehicles') {
      this.updateNonRevenueAsset = asset;
      $('#editnonRevenueVehiclesModal').modal();
    }

  }



  saveAssetUpdates(category) {
    // console.log(this.$scope);
    this.savingAssetSpinner = true;
    // console.log(this.updateRevenueAsset);
    console.log(this.updateRevenueAsset.Manufacturer.NTDManfCode);
    if(this.updateRevenueAsset.Manufacturer){
      this.updateRevenueAsset.ManufacturerCode = this.updateRevenueAsset.Manufacturer.NTDManfCode;
    }
    console.log(this.updateRevenueAsset.AssetUID);
    if(this.updateRevenueAsset.HistoricPresrvFlag){
      this.updateRevenueAsset.HistoricPresrvFlag = 1;
    } else if(!this.updateRevenueAsset.HistoricPresrvFlag){
      this.updateRevenueAsset.HistoricPresrvFlag = 0;
    }

    if(this.updateRevenueAsset.ADAFlag){
      this.updateRevenueAsset.ADAFlag = 1;
    } else if(!this.updateRevenueAsset.ADAFlag){
      this.updateRevenueAsset.ADAFlag = 0;
    }

    if(this.updateRevenueAsset.AdditionalModeSupport){
      // alert(this.updateRevenueAsset.AdditionalModeSupport);
      this.updateRevenueAsset.AdditionalModeSupport = 1;
    } else if(!this.updateRevenueAsset.AdditionalModeSupport){
      this.updateRevenueAsset.AdditionalModeSupport = 0;
    }
    console.log(this.updateRevenueAsset.HistoricPresrvFlag);
    console.log(this.updateRevenueAsset.ADAFlag);
    console.log(this.updateRevenueAsset.AdditionalModeSupport)
    var updateData = {
      AdditionalModeSupport:this.updateRevenueAsset.AdditionalModeSupport,
      PercentContingencyFleet: this.updateRevenueAsset.PercentContingencyFleet,
      LastRenewalYR: this.updateRevenueAsset.LastRenewalYR,
      LastRenewalType: this.updateRevenueAsset.LastRenewalType,
      AssetUID:this.updateRevenueAsset.AssetUID,
      ModeCode:this.updateRevenueAsset.ModeCode,
      NTDModeCode:this.updateRevenueAsset.NTDModeCode,
      AssetDesc:this.updateRevenueAsset.AssetDesc,
      AgencyDetail:this.updateRevenueAsset.AgencyDetail,
      AssetStatus:this.updateRevenueAsset.AssetStatus,
      AssetType:this.updateRevenueAsset.AssetType,
      YRBuilt:this.updateRevenueAsset.YRBuilt,
      YRInService:this.updateRevenueAsset.YRInService,
      AgencyUsefulLife:this.updateRevenueAsset.AgencyUsefulLife,
      Quantity:this.updateRevenueAsset.Quantity,
      UnitCost:this.updateRevenueAsset.UnitCost,
      AgencySoftCost:this.updateRevenueAsset.AgencySoftCost,
      AgencyAssetUID:this.updateRevenueAsset.AgencyAssetUID,
      PriorityStatus:this.updateRevenueAsset.PriorityStatus,
      Manufacturer:this.updateRevenueAsset.Manufacturer.NTDManfName,
      ManufacturerCode:this.updateRevenueAsset.Manufacturer.NTDManfCode,
      ModelNumber:this.updateRevenueAsset.ModelNumber,
      FuelType:this.updateRevenueAsset.FuelType,
      CapacitySeated:this.updateRevenueAsset.CapacitySeated,
      CapacityStanding:this.updateRevenueAsset.CapacityStanding,
      DelayReplaceAge:this.updateRevenueAsset.DelayReplaceAge,
      RVID:this.updateRevenueAsset.RVID,
      ADAFlag:this.updateRevenueAsset.ADAFlag,
       HistoricPresrvFlag:this.updateRevenueAsset.HistoricPresrvFlag,

    }
    console.log(updateData)
    console.log('delay replace age',this.updateRevenueAsset.DelayReplaceAge);
    this.updateAsset.category = category;
    // this.updateAsset = {};

    this.$http.put('/api/users/' + this.updateRevenueAsset.AssetUID + '/asset', updateData)
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
  .directive('pageSelect', function () {
    return {
      restrict: 'E',
      template: '<input type="text" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)">',
      link: function (scope, element, attrs) {
        scope.$watch('currentPage', function (c) {
          scope.inputPage = c;
        });
      }
    };
  })
  .directive("stResetSearch", function () {
    return {
      restrict: 'EA',
      require: '^stTable',
      link: function (scope, element, attrs, ctrl) {
        return element.bind('click', function () {
          return scope.$apply(function () {
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
