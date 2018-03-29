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
      $('#editadminAndMaintenanceModal').modal();
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
    // console.log(this.updateRevenueAsset.Manufacturer.NTDManfCode);
 
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
    console.log(this.updateRevenueAsset.AdditionalModeSupport);

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
      Manufacturer:this.updateRevenueAsset.Manufacturer,
      // ManufacturerCode:this.updateRevenueAsset.ManufacturerCode,
      ModelNumber:this.updateRevenueAsset.ModelNumber,
      FuelType:this.updateRevenueAsset.FuelType,
      CapacitySeated:this.updateRevenueAsset.CapacitySeated,
      CapacityStanding:this.updateRevenueAsset.CapacityStanding,
      DelayReplaceAge:this.updateRevenueAsset.DelayReplaceAge,
      RVID:this.updateRevenueAsset.RVID,
      ADAFlag:this.updateRevenueAsset.ADAFlag,
       HistoricPresrvFlag:this.updateRevenueAsset.HistoricPresrvFlag

    }
    console.log(updateData)
    console.log('delay replace age',this.updateRevenueAsset.DelayReplaceAge);
    this.updateRevenueAsset.category = category;
    // this.updateAsset = {};

    this.$http.put('/api/users/' + this.updateRevenueAsset.AssetUID + '/asset', updateData)
      .then(response => {
        console.log(response);
        if (response.data.returnValue === 0) {
          this.$scope.updateTable('revenuevehicles');

          $('#editRevenueVehiclesModal').modal('hide');
          this.savingAssetSpinner = false;
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  saveNonRevenueAsset(category) {
    // console.log(this.$scope);
    this.savingAssetSpinner = true;
    var updateData = {};
    // console.log(this.updateRevenueAsset);
    // console.log(this.updateNonRevenueAsset.Manufacturer.NTDManfCode);
  
    // console.log(this.updateNonRevenueAsset);
  

    updateData = {
     
      AssetUID:this.updateNonRevenueAsset.AssetUID,
      ModeCode:this.updateNonRevenueAsset.ModeCode,
      NTDModeCode:this.updateNonRevenueAsset.NTDModeCode,
      AssetDesc:this.updateNonRevenueAsset.AssetDesc,
      AgencyDetail:this.updateNonRevenueAsset.AgencyDetail,
      AssetStatus:this.updateNonRevenueAsset.AssetStatus,
      AssetType:this.updateNonRevenueAsset.AssetType,
      YRBuilt:this.updateNonRevenueAsset.YRBuilt,
      YRInService:this.updateNonRevenueAsset.YRInService,
      AgencyUsefulLife:this.updateNonRevenueAsset.AgencyUsefulLife,
      Quantity:this.updateNonRevenueAsset.Quantity,
      UnitType:this.updateNonRevenueAsset.UnitType,
      UnitCost:this.updateNonRevenueAsset.UnitCost,
      AgencySoftCost:this.updateNonRevenueAsset.AgencySoftCost,
      AgencyAssetUID:this.updateNonRevenueAsset.AgencyAssetUID,
      PriorityStatus:this.updateNonRevenueAsset.PriorityStatus,
      Manufacturer:this.updateNonRevenueAsset.Manufacturer,
      ModelNumber:this.updateNonRevenueAsset.ModelNumber,
      FuelType:this.updateNonRevenueAsset.FuelType,
      AgencyCapitalResponsibility:this.updateNonRevenueAsset.AgencyCapitalResponsibility,
      DelayReplaceAge:this.updateNonRevenueAsset.DelayReplaceAge,
      LastRenewalYR: this.updateNonRevenueAsset.LastRenewalYR,
      LastRenewalType: this.updateNonRevenueAsset.LastRenewalType,
    }
console.log(updateData.UnitType);
    console.log(updateData)
    this.updateNonRevenueAsset.category = category;
   
    this.$http.put('/api/users/' + this.updateNonRevenueAsset.AssetUID + '/asset/nonrevenue', updateData)
      .then(response => {
        console.log(response);
        if (response.data.returnValue === 0) {
          this.$scope.updateTable('nonrevenuevehicles');

          $('#editnonRevenueVehiclesModal').modal('hide');
          this.savingAssetSpinner = false;
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  savePassengerFacility(category) {
    // console.log(this.$scope);
    this.savingAssetSpinner = true;
    // console.log(this.updateRevenueAsset);
    
    console.log(this.updatePassengerAsset.AssetUID);
  

    var updateData = {
     
      AssetUID:this.updatePassengerAsset.AssetUID,
      ModeCode:this.updatePassengerAsset.ModeCode,
      NTDModeCode:this.updatePassengerAsset.NTDModeCode,
      AssetDesc:this.updatePassengerAsset.AssetDesc,
      AgencyDetail:this.updatePassengerAsset.AgencyDetail,
      AssetStatus:this.updatePassengerAsset.AssetStatus,
      AssetType:this.updatePassengerAsset.AssetType,
      YRBuilt:this.updatePassengerAsset.YRBuilt,
      Quantity:this.updatePassengerAsset.Quantity,
      UnitType:this.updatePassengerAsset.UnitType,
      UnitCost:this.updatePassengerAsset.UnitCost,
      AgencySoftCost:this.updatePassengerAsset.AgencySoftCost,
      AgencyAssetUID:this.updatePassengerAsset.AgencyAssetUID,
      PriorityStatus:this.updatePassengerAsset.PriorityStatus,
      LastRenewalYR: this.updatePassengerAsset.LastRenewalYR,
      LastRenewalType: this.updatePassengerAsset.LastRenewalType,
      HistoricPresrvFlag:this.updatePassengerAsset.HistoricPresrvFlag,
      DateofLastCondAssessment:this.updatePassengerAsset.DateofLastCondAssessment,
      AgencyConditionRating:this.updatePassengerAsset.AgencyConditionRating,
      AgencyCapitalResponsibility:this.updatePassengerAsset.AgencyCapitalResponsibility,
      SquareFootage:this.updatePassengerAsset.SquareFootage,
      AssetPhysAddress:this.updatePassengerAsset.AssetPhysAddress,
      AssetPhysCity:this.updatePassengerAsset.AssetPhysCity,
      AssetPhysState:this.updatePassengerAsset.AssetPhysState,
      AssetPhysZIP:this.updatePassengerAsset.AssetPhysZIP,
      Latitude:this.updatePassengerAsset.Latitude,
      Longitude:this.updatePassengerAsset.Longitude
    }
    console.log(updateData)
    this.updatePassengerAsset.category = category;
   
    this.$http.put('/api/users/' + this.updatePassengerAsset.AssetUID + '/asset/passengerfacility', updateData)
      .then(response => {
        console.log(response);
        if (response.data.returnValue === 0) {
          this.$scope.updateTable('passengerfacilities');

          $('#editpassengerFacilitiesModal').modal('hide');
          this.savingAssetSpinner = false;
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  saveAdminMaintFacility(category) {
    // console.log(this.$scope);
    this.savingAssetSpinner = true;
    // console.log(this.updateRevenueAsset);
    
    console.log(this.updateMAAsset.AssetUID);
  

    var updateData = {
     
      AssetUID:this.updateMAAsset.AssetUID,
      AssetDesc:this.updateMAAsset.AssetDesc,
      AgencyDetail:this.updateMAAsset.AgencyDetail,
      AssetStatus:this.updateMAAsset.AssetStatus,
      AssetType:this.updateMAAsset.AssetType,
      YRBuilt:this.updateMAAsset.YRBuilt,
      Quantity:this.updateMAAsset.Quantity,
      UnitType:this.updateMAAsset.UnitType,
      UnitCost:this.updateMAAsset.UnitCost,
      AgencySoftCost:this.updateMAAsset.AgencySoftCost,
      AgencyAssetUID:this.updateMAAsset.AgencyAssetUID,
      PriorityStatus:this.updateMAAsset.PriorityStatus,
      LastRenewalYR: this.updateMAAsset.LastRenewalYR,
      LastRenewalType: this.updateMAAsset.LastRenewalType,
      HistoricPresrvFlag:this.updateMAAsset.HistoricPresrvFlag,
      DateofLastCondAssessment:this.updateMAAsset.DateofLastCondAssessment,
      AgencyConditionRating:this.updateMAAsset.AgencyConditionRating,
      AgencyCapitalResponsibility:this.updateMAAsset.AgencyCapitalResponsibility,
      SquareFootage:this.updateMAAsset.SquareFootage,
      AssetPhysAddress:this.updateMAAsset.AssetPhysAddress,
      AssetPhysCity:this.updateMAAsset.AssetPhysCity,
      AssetPhysState:this.updateMAAsset.AssetPhysState,
      AssetPhysZIP:this.updateMAAsset.AssetPhysZIP,
      Latitude:this.updateMAAsset.Latitude,
      Longitude:this.updateMAAsset.Longitude
    }
    console.log(updateData)
    this.updateMAAsset.category = category;
   
    this.$http.put('/api/users/' + this.updateMAAsset.AssetUID + '/asset/adminmaintfacility', updateData)
      .then(response => {
        console.log(response);
        if (response.data.returnValue === 0) {
          this.$scope.updateTable('mandafacilities');

          $('#editadminAndMaintenanceModal').modal('hide');
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
