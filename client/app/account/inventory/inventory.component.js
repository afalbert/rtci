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

        this.priorityStatus = [1, 2, 3, 4];
        this.manufacturerCodes = manufacturerCodes;


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

        // $scope.getAssets();
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
            } else if (category === 'infrastructure') {
                $scope.type = ': Infrastructure';
            } else if (category === 'systems') {
                $scope.type = ': Systems';
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

        $scope.updateTable('revenuevehicles');

        $scope.selectAll = function() {
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
        $scope.unselectAllAssets = function() {
            $scope.rowCollection.forEach(element => {
                var asset = element;
                $scope.bulkIds.forEach(element => {
                    var assetid = element;
                    if (assetid === asset.AssetUID) {
                        //    console.log(asset.AssetUID);
                        asset.isSelected = false;
                        asset.isChecked = false;
                        $scope.numOfBulkAssets = 0;
                        $scope.bulkIds.splice($scope.bulkIds.indexOf(assetid), 1);
                    }
                });

                //    $scope.bulkIds = [];

            });
        }
        $scope.updateBulkIds = function(asset) {
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
    openBulkModal() {
        if (!this.$scope.category) {
            $('#bulkEditRevenueVehiclesModal').modal();
        } else if (this.$scope.category && this.$scope.category === 'passengerfacilities') {
            $('#bulkEditPassengerModal').modal();
        } else if (this.$scope.category && this.$scope.category === 'mandafacilities') {
            $('#editadminAndMaintenanceModal').modal();
        } else if (this.$scope.category && this.$scope.category === 'revenuevehicles') {
            $('#bulkEditRevenueVehiclesModal').modal();
        } else if (this.$scope.category && this.$scope.category === 'nonrevenuevehicles') {
            $('#editnonRevenueVehiclesModal').modal();
        } else if (this.$scope.category && this.$scope.category === 'infrastructure') {
            $('#bulkInfrastructureModal').modal();
        } else if (this.$scope.category && this.$scope.category === 'systems') {
            $('#bulkSystemModal').modal();
        }
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
        } else if (this.$scope.category && this.$scope.category === 'infrastructure') {
            this.editInfrastructure = asset;
            if (asset.PriorityStatus) {
                this.editInfrastructure.PriorityStatus = asset.PriorityStatus.toString();
            }
            console.log(this.editInfrastructure);
            $('#editInfrastructureModal').modal();
        } else if (this.$scope.category && this.$scope.category === 'systems') {
            this.editSystems = asset;
            if (asset.PriorityStatus) {
                this.editSystems.PriorityStatus = asset.PriorityStatus.toString();
            }
            $('#editSystemModal').modal();
        }

    }



    saveAssetUpdates(category) {
        // console.log(this.$scope);
        this.savingAssetSpinner = true;
        // console.log(this.updateRevenueAsset);
        // console.log(this.updateRevenueAsset.Manufacturer.NTDManfCode);

        console.log(this.updateRevenueAsset.AssetUID);
        if (this.updateRevenueAsset.HistoricPresrvFlag) {
            this.updateRevenueAsset.HistoricPresrvFlag = 1;
        } else if (!this.updateRevenueAsset.HistoricPresrvFlag) {
            this.updateRevenueAsset.HistoricPresrvFlag = 0;
        }

        if (this.updateRevenueAsset.ADAFlag) {
            this.updateRevenueAsset.ADAFlag = 1;
        } else if (!this.updateRevenueAsset.ADAFlag) {
            this.updateRevenueAsset.ADAFlag = 0;
        }

        if (this.updateRevenueAsset.AdditionalModeSupport) {
            // alert(this.updateRevenueAsset.AdditionalModeSupport);
            this.updateRevenueAsset.AdditionalModeSupport = 1;
        } else if (!this.updateRevenueAsset.AdditionalModeSupport) {
            this.updateRevenueAsset.AdditionalModeSupport = 0;
        }
        console.log(this.updateRevenueAsset.HistoricPresrvFlag);
        console.log(this.updateRevenueAsset.ADAFlag);
        console.log(this.updateRevenueAsset.AdditionalModeSupport);

        var updateData = {
            AdditionalModeSupport: this.updateRevenueAsset.AdditionalModeSupport,
            PercentContingencyFleet: this.updateRevenueAsset.PercentContingencyFleet,
            LastRenewalYR: this.updateRevenueAsset.LastRenewalYR,
            LastRenewalType: this.updateRevenueAsset.LastRenewalType,
            AssetUID: this.updateRevenueAsset.AssetUID,
            ModeCode: this.updateRevenueAsset.ModeCode,
            NTDModeCode: this.updateRevenueAsset.NTDModeCode,
            AssetDesc: this.updateRevenueAsset.AssetDesc,
            AgencyDetail: this.updateRevenueAsset.AgencyDetail,
            AssetStatus: this.updateRevenueAsset.AssetStatus,
            AssetType: this.updateRevenueAsset.AssetType,
            YRBuilt: this.updateRevenueAsset.YRBuilt,
            YRInService: this.updateRevenueAsset.YRInService,
            AgencyUsefulLife: this.updateRevenueAsset.AgencyUsefulLife,
            Quantity: this.updateRevenueAsset.Quantity,
            UnitCost: this.updateRevenueAsset.UnitCost,
            AgencySoftCost: this.updateRevenueAsset.AgencySoftCost,
            AgencyAssetUID: this.updateRevenueAsset.AgencyAssetUID,
            PriorityStatus: this.updateRevenueAsset.PriorityStatus,
            Manufacturer: this.updateRevenueAsset.Manufacturer,
            ModelNumber: this.updateRevenueAsset.ModelNumber,
            FuelType: this.updateRevenueAsset.FuelType,
            CapacitySeated: this.updateRevenueAsset.CapacitySeated,
            CapacityStanding: this.updateRevenueAsset.CapacityStanding,
            DelayReplaceAge: this.updateRevenueAsset.DelayReplaceAge,
            RVID: this.updateRevenueAsset.RVID,
            ADAFlag: this.updateRevenueAsset.ADAFlag,
            HistoricPresrvFlag: this.updateRevenueAsset.HistoricPresrvFlag

        };
        console.log(updateData);
        var bulkRevenueData;
        if (this.$scope.bulkIds.length > 0) {
            console.log(this.$scope.bulkIds);
            bulkRevenueData = {
                AdditionalModeSupport: this.bulkRevenue.AdditionalModeSupport,
                PercentContingencyFleet: this.bulkRevenue.PercentContingencyFleet,
                LastRenewalYR: this.bulkRevenue.LastRenewalYR,
                LastRenewalType: this.bulkRevenue.LastRenewalType,
                AssetUID: this.$scope.bulkIds,
                ModeCode: this.bulkRevenue.ModeCode,
                NTDModeCode: this.bulkRevenue.NTDModeCode,
                AssetStatus: this.bulkRevenue.AssetStatus,
                AgencyUsefulLife: this.bulkRevenue.AgencyUsefulLife,
                Quantity: this.bulkRevenue.Quantity,
                UnitCost: this.bulkRevenue.UnitCost,
                AgencySoftCost: this.bulkRevenue.AgencySoftCost,
                PriorityStatus: this.bulkRevenue.PriorityStatus,
                CapacitySeated: this.bulkRevenue.CapacitySeated,
                CapacityStanding: this.bulkRevenue.CapacityStanding,
                DelayReplaceAge: this.bulkRevenue.DelayReplaceAge,
                ADAFlag: this.bulkRevenue.ADAFlag,
                HistoricPresrvFlag: this.bulkRevenue.HistoricPresrvFlag

            };
        }
        console.log(updateData);
        console.log('delay replace age', this.updateRevenueAsset.DelayReplaceAge);
        this.updateRevenueAsset.category = category;
        this.updateAsset = {};
        this.bulkRevenue = {};
        var updateType;
        var data;
        if (this.$scope.bulkIds.length > 0) {
            updateType = 'bulk';
            data = bulkRevenueData;
        } else {
            updateType = 'single';
            data = updateData;
        }

        this.$http.put('/api/users/' + updateType + '/asset', data)
            .then(response => {
                console.log(response);
                if (response.data.returnValue === 0) {
                    this.$scope.updateTable('revenuevehicles');

                    $('#editRevenueVehiclesModal').modal('hide');
                    $('#bulkEditRevenueVehiclesModal').modal('hide');
                    this.$scope.bulkIds = [];
                    this.$scope.numOfBulkAssets = 0;

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
        var updateData, bulkData;

        if (!this.$scope.bulkIds || this.$scope.bulkIds.length === 0) {
            updateData = {

                AssetUID: this.updateNonRevenueAsset.AssetUID,
                ModeCode: this.updateNonRevenueAsset.ModeCode,
                NTDModeCode: this.updateNonRevenueAsset.NTDModeCode,
                AssetDesc: this.updateNonRevenueAsset.AssetDesc,
                AgencyDetail: this.updateNonRevenueAsset.AgencyDetail,
                AssetStatus: this.updateNonRevenueAsset.AssetStatus,
                AssetType: this.updateNonRevenueAsset.AssetType,
                YRBuilt: this.updateNonRevenueAsset.YRBuilt,
                YRInService: this.updateNonRevenueAsset.YRInService,
                AgencyUsefulLife: this.updateNonRevenueAsset.AgencyUsefulLife,
                Quantity: this.updateNonRevenueAsset.Quantity,
                UnitType: this.updateNonRevenueAsset.UnitType,
                UnitCost: this.updateNonRevenueAsset.UnitCost,
                AgencySoftCost: this.updateNonRevenueAsset.AgencySoftCost,
                AgencyAssetUID: this.updateNonRevenueAsset.AgencyAssetUID,
                PriorityStatus: this.updateNonRevenueAsset.PriorityStatus,
                Manufacturer: this.updateNonRevenueAsset.Manufacturer,
                ModelNumber: this.updateNonRevenueAsset.ModelNumber,
                FuelType: this.updateNonRevenueAsset.FuelType,
                AgencyCapitalResponsibility: this.updateNonRevenueAsset.AgencyCapitalResponsibility,
                DelayReplaceAge: this.updateNonRevenueAsset.DelayReplaceAge,
                LastRenewalYR: this.updateNonRevenueAsset.LastRenewalYR,
                LastRenewalType: this.updateNonRevenueAsset.LastRenewalType
            };
        }


        if (this.$scope.bulkIds.length > 0) {
            console.log(this.$scope.bulkIds);
            bulkData = {
                AssetUID: this.$scope.bulkIds,
                ModeCode: this.bulkNonRevenue.ModeCode,
                NTDModeCode: this.bulkNonRevenue.NTDModeCode,
                AssetDesc: this.bulkNonRevenue.AssetDesc,
                AgencyDetail: this.bulkNonRevenue.AgencyDetail,
                AssetStatus: this.bulkNonRevenue.AssetStatus,
                AssetType: this.bulkNonRevenue.AssetType,
                YRBuilt: this.bulkNonRevenue.YRBuilt,
                YRInService: this.bulkNonRevenue.YRInService,
                AgencyUsefulLife: this.bulkNonRevenue.AgencyUsefulLife,
                Quantity: this.bulkNonRevenue.Quantity,
                UnitType: this.bulkNonRevenue.UnitType,
                UnitCost: this.bulkNonRevenue.UnitCost,
                AgencySoftCost: this.bulkNonRevenue.AgencySoftCost,
                AgencyAssetUID: this.bulkNonRevenue.AgencyAssetUID,
                PriorityStatus: this.bulkNonRevenue.PriorityStatus,
                Manufacturer: this.bulkNonRevenue.Manufacturer,
                ModelNumber: this.bulkNonRevenue.ModelNumber,
                FuelType: this.bulkNonRevenue.FuelType,
                AgencyCapitalResponsibility: this.bulkNonRevenue.AgencyCapitalResponsibility,
                DelayReplaceAge: this.bulkNonRevenue.DelayReplaceAge,
                LastRenewalYR: this.bulkNonRevenue.LastRenewalYR,
                LastRenewalType: this.bulkNonRevenue.LastRenewalType,

            };
        }

        this.bulkNonRevenue = {};
        this.updateNonRevenueAsset = {};
        var updateType;
        var data;
        if (this.$scope.bulkIds.length > 0) {
            updateType = 'bulk';
            data = bulkData;
        } else {
            updateType = 'single';
            data = updateData;
        }

        this.$http.put('/api/users/' + updateType + '/asset/nonrevenue', data)
            .then(response => {
                console.log(response);
                if (response.data.returnValue === 0) {
                    this.$scope.updateTable('nonrevenuevehicles');

                    this.$scope.updateTable('nonrevenuevehicles');
                    $('#editnonRevenueVehiclesModal').modal('hide');
                    $('#bulkEditNonRevenueModal').modal('hide');
                    this.$scope.bulkIds = [];
                    this.$scope.numOfBulkAssets = 0;
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
        var updateData, bulkData;

        if (!this.$scope.bulkIds || this.$scope.bulkIds.length === 0) {
            updateData = {
                AssetUID: this.updatePassengerAsset.AssetUID,
                ModeCode: this.updatePassengerAsset.ModeCode,
                NTDModeCode: this.updatePassengerAsset.NTDModeCode,
                AssetDesc: this.updatePassengerAsset.AssetDesc,
                AgencyDetail: this.updatePassengerAsset.AgencyDetail,
                AssetStatus: this.updatePassengerAsset.AssetStatus,
                AssetType: this.updatePassengerAsset.AssetType,
                YRBuilt: this.updatePassengerAsset.YRBuilt,
                Quantity: this.updatePassengerAsset.Quantity,
                UnitType: this.updatePassengerAsset.UnitType,
                UnitCost: this.updatePassengerAsset.UnitCost,
                AgencySoftCost: this.updatePassengerAsset.AgencySoftCost,
                AgencyAssetUID: this.updatePassengerAsset.AgencyAssetUID,
                PriorityStatus: this.updatePassengerAsset.PriorityStatus,
                LastRenewalYR: this.updatePassengerAsset.LastRenewalYR,
                LastRenewalType: this.updatePassengerAsset.LastRenewalType,
                HistoricPresrvFlag: this.updatePassengerAsset.HistoricPresrvFlag,
                DateofLastCondAssessment: this.updatePassengerAsset.DateofLastCondAssessment,
                AgencyConditionRating: this.updatePassengerAsset.AgencyConditionRating,
                AgencyCapitalResponsibility: this.updatePassengerAsset.AgencyCapitalResponsibility,
                SquareFootage: this.updatePassengerAsset.SquareFootage,
                AssetPhysAddress: this.updatePassengerAsset.AssetPhysAddress,
                AssetPhysCity: this.updatePassengerAsset.AssetPhysCity,
                AssetPhysState: this.updatePassengerAsset.AssetPhysState,
                AssetPhysZIP: this.updatePassengerAsset.AssetPhysZIP,
                Latitude: this.updatePassengerAsset.Latitude,
                Longitude: this.updatePassengerAsset.Longitude
            };

        }

        if (this.$scope.bulkIds.length > 0) {
            console.log(this.$scope.bulkIds);
            bulkData = {
                AssetUID: this.$scope.bulkIds,
                ModeCode: this.bulkPassenger.ModeCode,
                NTDModeCode: this.bulkPassenger.NTDModeCode,
                AssetStatus: this.bulkPassenger.AssetStatus,
                Quantity: this.bulkPassenger.Quantity,
                UnitType: this.bulkPassenger.UnitType,
                AgencySoftCost: this.bulkPassenger.AgencySoftCost,
                PriorityStatus: this.bulkPassenger.PriorityStatus,
                LastRenewalYR: this.bulkPassenger.LastRenewalYR,
                LastRenewalType: this.bulkPassenger.LastRenewalType,
                HistoricPresrvFlag: this.bulkPassenger.HistoricPresrvFlag,
                DateofLastCondAssessment: this.bulkPassenger.DateofLastCondAssessment,
                AgencyConditionRating: this.bulkPassenger.AgencyConditionRating,
                AgencyCapitalResponsibility: this.bulkPassenger.AgencyCapitalResponsibility,
                SquareFootage: this.bulkPassenger.SquareFootage,
                AssetPhysAddress: this.bulkPassenger.AssetPhysAddress,
                AssetPhysCity: this.bulkPassenger.AssetPhysCity,
                AssetPhysState: this.bulkPassenger.AssetPhysState,
                AssetPhysZIP: this.bulkPassenger.AssetPhysZIP,
                Latitude: this.bulkPassenger.Latitude,
                Longitude: this.bulkPassenger.Longitude

            };
        }

        this.bulkPassenger = {};
        this.updatePassengerAsset = {};
        var updateType;
        var data;
        if (this.$scope.bulkIds.length > 0) {
            updateType = 'bulk';
            data = bulkData;
        } else {
            updateType = 'single';
            data = updateData;
        }


        console.log(updateData);

        this.$http.put('/api/users/' + updateType + '/asset/passengerfacility', data)
            .then(response => {
                console.log(response);
                if (response.data.returnValue === 0) {
                    this.$scope.updateTable('passengerfacilities');
                    $('#editpassengerFacilitiesModal').modal('hide');
                    $('#bulkEditPassengerModal').modal('hide');
                    this.$scope.bulkIds = [];
                    this.$scope.numOfBulkAssets = 0;
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
        var updateData, bulkData;

        if (!this.$scope.bulkIds || this.$scope.bulkIds.length === 0) {
            updateData = {

                AssetUID: this.updateMAAsset.AssetUID,
                AssetDesc: this.updateMAAsset.AssetDesc,
                AgencyDetail: this.updateMAAsset.AgencyDetail,
                AssetStatus: this.updateMAAsset.AssetStatus,
                AssetType: this.updateMAAsset.AssetType,
                YRBuilt: this.updateMAAsset.YRBuilt,
                Quantity: this.updateMAAsset.Quantity,
                UnitType: this.updateMAAsset.UnitType,
                UnitCost: this.updateMAAsset.UnitCost,
                AgencySoftCost: this.updateMAAsset.AgencySoftCost,
                AgencyAssetUID: this.updateMAAsset.AgencyAssetUID,
                PriorityStatus: this.updateMAAsset.PriorityStatus,
                LastRenewalYR: this.updateMAAsset.LastRenewalYR,
                LastRenewalType: this.updateMAAsset.LastRenewalType,
                HistoricPresrvFlag: this.updateMAAsset.HistoricPresrvFlag,
                DateofLastCondAssessment: this.updateMAAsset.DateofLastCondAssessment,
                AgencyConditionRating: this.updateMAAsset.AgencyConditionRating,
                AgencyCapitalResponsibility: this.updateMAAsset.AgencyCapitalResponsibility,
                SquareFootage: this.updateMAAsset.SquareFootage,
                AssetPhysAddress: this.updateMAAsset.AssetPhysAddress,
                AssetPhysCity: this.updateMAAsset.AssetPhysCity,
                AssetPhysState: this.updateMAAsset.AssetPhysState,
                AssetPhysZIP: this.updateMAAsset.AssetPhysZIP,
                Latitude: this.updateMAAsset.Latitude,
                Longitude: this.updateMAAsset.Longitude
            };
        }

        if (this.$scope.bulkIds.length > 0) {
            console.log(this.$scope.bulkIds);
            bulkData = {
                AssetUID: this.$scope.bulkIds,
                AssetDesc: this.bulkMA.AssetDesc,
                AgencyDetail: this.bulkMA.AgencyDetail,
                AssetStatus: this.bulkMA.AssetStatus,
                AssetType: this.bulkMA.AssetType,
                YRBuilt: this.bulkMA.YRBuilt,
                Quantity: this.bulkMA.Quantity,
                UnitType: this.bulkMA.UnitType,
                UnitCost: this.bulkMA.UnitCost,
                AgencySoftCost: this.bulkMA.AgencySoftCost,
                AgencyAssetUID: this.bulkMA.AgencyAssetUID,
                PriorityStatus: this.bulkMA.PriorityStatus,
                LastRenewalYR: this.bulkMA.LastRenewalYR,
                LastRenewalType: this.bulkMA.LastRenewalType,
                HistoricPresrvFlag: this.bulkMA.HistoricPresrvFlag,
                DateofLastCondAssessment: this.bulkMA.DateofLastCondAssessment,
                AgencyConditionRating: this.bulkMA.AgencyConditionRating,
                AgencyCapitalResponsibility: this.bulkMA.AgencyCapitalResponsibility,
                SquareFootage: this.bulkMA.SquareFootage,
                AssetPhysAddress: this.bulkMA.AssetPhysAddress,
                AssetPhysCity: this.bulkMA.AssetPhysCity,
                AssetPhysState: this.bulkMA.AssetPhysState,
                AssetPhysZIP: this.bulkMA.AssetPhysZIP,
                Latitude: this.bulkMA.Latitude,
                Longitude: this.bulkMA.Longitude

            };
        }

        this.bulkMA = {};
        this.updateMAAsset = {};
        var updateType;
        var data;
        if (this.$scope.bulkIds.length > 0) {
            updateType = 'bulk';
            data = bulkData;
        } else {
            updateType = 'single';
            data = updateData;
        }

        this.$http.put('/api/users/' + updateType + '/asset/adminmaintfacility', data)
            .then(response => {
                console.log(response);
                if (response.data.returnValue === 0) {
                    this.$scope.updateTable('mandafacilities');

                    this.$scope.updateTable('passengerfacilities');
                    $('#editadminAndMaintenanceModal').modal('hide');
                    $('#bulkAdminMaintModal').modal('hide');
                    this.$scope.bulkIds = [];
                    this.$scope.numOfBulkAssets = 0;
                    this.savingAssetSpinner = false;

                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    saveInfrastructure(category) {
        console.log('saving infrastructure');
        this.savingAssetSpinner = true;
        var updateData, bulkData;

        if (!this.$scope.bulkIds || this.$scope.bulkIds.length === 0) {
            updateData = {
                AssetUID: this.editInfrastructure.AssetUID,
                AgencyAssetUID: this.editInfrastructure.AgencyAssetUID,
                AssetDesc: this.editInfrastructure.AssetDesc,
                AgencyDetail: this.editInfrastructure.AgencyDetail,
                AssetType: this.editInfrastructure.AssetType,
                ModeCode: this.editInfrastructure.ModeCode,
                NTDModeCode: this.editInfrastructure.NTDModeCode,
                Quantity: this.editInfrastructure.Quantity,
                UnitType: this.editInfrastructure.UnitType,
                UnitCost: this.editInfrastructure.UnitCost,
                AgencySoftCost: this.editInfrastructure.AgencySoftCost,
                YRBuilt: this.editInfrastructure.YRBuilt,
                YRInService: this.editInfrastructure.YRInService,
                AgencyUsefulLife: this.editInfrastructure.AgencyUsefulLife,
                DelayReplaceAge: this.editInfrastructure.DelayReplaceAge,
                Latitude: this.editInfrastructure.Latitude,
                Longitude: this.editInfrastructure.Longitude,
                AssetStatus: this.editInfrastructure.AssetStatus,
                AgencyCapitalResponsibility: this.editInfrastructure.AgencyCapitalResponsibility,
                PriorityStatus: this.editInfrastructure.PriorityStatus,
                LineDivision: this.editInfrastructure.LineDivision,
                BranchGarage: this.editInfrastructure.BranchGarage,
                SegmentRoute: this.editInfrastructure.SegmentRoute,
                LocLinearStart: this.editInfrastructure.LocLinearStart,
                LocLinearEnd: this.editInfrastructure.LocLinearEnd
            };
        }


        if (this.$scope.bulkIds.length > 0) {
            console.log(this.$scope.bulkIds);
            bulkData = {
                AssetUID: this.$scope.bulkIds,
                Quantity: this.bulkInfrastructure.Quantity,
                UnitType: this.bulkInfrastructure.UnitType,
                UnitCost: this.bulkInfrastructure.UnitCost,
                AgencySoftCost: this.bulkInfrastructure.AgencySoftCost,
                AgencyUsefulLife: this.bulkInfrastructure.AgencyUsefulLife,
                DelayReplaceAge: this.bulkInfrastructure.DelayReplaceAge,
                AssetStatus: this.bulkInfrastructure.AssetStatus,
                AgencyCapitalResponsibility: this.bulkInfrastructure.AgencyCapitalResponsibility,
                PriorityStatus: this.bulkInfrastructure.PriorityStatus,
                LineDivision: this.bulkInfrastructure.LineDivision,
                BranchGarage: this.bulkInfrastructure.BranchGarage,
                SegmentRoute: this.bulkInfrastructure.SegmentRoute,
                LocLinearStart: this.bulkInfrastructure.LocLinearStart,
                LocLinearEnd: this.bulkInfrastructure.LocLinearEnd
            };
        }

        this.bulkInfrastructure = {};
        this.editInfrastructure = {};
        var updateType;
        var data;
        if (this.$scope.bulkIds.length > 0) {
            updateType = 'bulk';
            data = bulkData;
        } else {
            updateType = 'single';
            data = updateData;
        }
        console.log(updateData);

        this.$http.put('/api/users/' + updateType + '/asset/infrastructure', data)
            .then(response => {
                console.log(response);
                if (response.data.returnValue === 0) {
                    this.$scope.updateTable('infrastructure');
                    $('#editInfrastructureModal').modal('hide');
                    $('#bulkInfrastructureModal').modal('hide');
                    this.$scope.bulkIds = [];
                    this.$scope.numOfBulkAssets = 0;
                    this.savingAssetSpinner = false;
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    saveSystem(category) {
        console.log('saving system');
        this.savingAssetSpinner = true;
        var updateData, bulkData;

        if (!this.$scope.bulkIds || this.$scope.bulkIds.length === 0) {
            updateData = {

                AssetUID: this.editSystems.AssetUID,
                AgencyAssetUID: this.editSystems.AgencyAssetUID,
                AssetDesc: this.editSystems.AssetDesc,
                AgencyDetail: this.editSystems.AgencyDetail,
                AssetType: this.editSystems.AssetType,
                ModeCode: this.editSystems.ModeCode,
                NTDModeCode: this.editSystems.NTDModeCode,
                Quantity: this.editSystems.Quantity,
                UnitType: this.editSystems.UnitType,
                UnitCost: this.editSystems.UnitCost,
                AgencySoftCost: this.editSystems.AgencySoftCost,
                YRBuilt: this.editSystems.YRBuilt,
                YRInService: this.editSystems.YRInService,
                AgencyUsefulLife: this.editSystems.AgencyUsefulLife,
                DelayReplaceAge: this.editSystems.DelayReplaceAge,
                AssetPhysAddress: this.editSystems.AssetPhysAddress,
                AssetPhysCity: this.editSystems.AssetPhysCity,
                AssetPhysState: this.editSystems.AssetPhysState,
                AssetPhysZIP: this.editSystems.AssetPhysZIP,
                Latitude: this.editSystems.Latitude,
                Longitude: this.editSystems.Longitude,
                AssetStatus: this.editSystems.AssetStatus,
                PriorityStatus: this.editSystems.PriorityStatus
            };
        }


        if (this.$scope.bulkIds.length > 0) {
            console.log(this.$scope.bulkIds);
            bulkData = {
                AssetUID: this.$scope.bulkIds,
                Quantity: this.bulkSystem.Quantity,
                UnitType: this.bulkSystem.UnitType,
                UnitCost: this.bulkSystem.UnitCost,
                AgencySoftCost: this.bulkSystem.AgencySoftCost,
                YRInService: this.bulkSystem.YRInService,
                AgencyUsefulLife: this.bulkSystem.AgencyUsefulLife,
                DelayReplaceAge: this.bulkSystem.DelayReplaceAge,
                AssetPhysAddress: this.bulkSystem.AssetPhysAddress,
                AssetPhysCity: this.bulkSystem.AssetPhysCity,
                AssetPhysState: this.bulkSystem.AssetPhysState,
                AssetPhysZIP: this.bulkSystem.AssetPhysZIP,
                Latitude: this.bulkSystem.Latitude,
                Longitude: this.bulkSystem.Longitude,
                AssetStatus: this.bulkSystem.AssetStatus,
                PriorityStatus: this.bulkSystem.PriorityStatus

            };
        }

        this.bulkSystem = {};
        this.editSystems = {};
        var updateType;
        var data;
        if (this.$scope.bulkIds.length > 0) {
            updateType = 'bulk';
            data = bulkData;
        } else {
            updateType = 'single';
            data = updateData;
        }
        console.log(updateData);

        this.$http.put('/api/users/' + updateType + '/asset/system', data)
            .then(response => {
                console.log(response);
                if (response.data.returnValue === 0) {
                    this.$scope.updateTable('systems');
                    $('#editSystemModal').modal('hide');
                    $('#bulkSystemModal').modal('hide');
                    this.$scope.bulkIds = [];
                    this.$scope.numOfBulkAssets = 0;
                    this.savingAssetSpinner = false;

                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    createRevenueVehicle() {

        this.savingAssetSpinner = true;

        var addData = {
            AdditionalModeSupport: this.addRevenueAsset.AdditionalModeSupport,
            PercentContingencyFleet: this.addRevenueAsset.PercentContingencyFleet,
            LastRenewalYR: this.addRevenueAsset.LastRenewalYR,
            LastRenewalType: this.addRevenueAsset.LastRenewalType,
            AssetUID: this.addRevenueAsset.AssetUID,
            ModeCode: this.addRevenueAsset.ModeCode,
            NTDModeCode: this.addRevenueAsset.NTDModeCode,
            AssetDesc: this.addRevenueAsset.AssetDesc,
            AgencyDetail: this.addRevenueAsset.AgencyDetail,
            AssetStatus: this.addRevenueAsset.AssetStatus,
            AssetType: this.addRevenueAsset.AssetType,
            YRBuilt: this.addRevenueAsset.YRBuilt,
            YRInService: this.addRevenueAsset.YRInService,
            AgencyUsefulLife: this.addRevenueAsset.AgencyUsefulLife,
            Quantity: this.addRevenueAsset.Quantity,
            UnitCost: this.addRevenueAsset.UnitCost,
            AgencySoftCost: this.addRevenueAsset.AgencySoftCost,
            AgencyAssetUID: this.addRevenueAsset.AgencyAssetUID,
            PriorityStatus: this.addRevenueAsset.PriorityStatus,
            Manufacturer: this.addRevenueAsset.Manufacturer,
            ModelNumber: this.addRevenueAsset.ModelNumber,
            FuelType: this.addRevenueAsset.FuelType,
            CapacitySeated: this.addRevenueAsset.CapacitySeated,
            CapacityStanding: this.addRevenueAsset.CapacityStanding,
            DelayReplaceAge: this.addRevenueAsset.DelayReplaceAge,
            RVID: this.addRevenueAsset.RVID,
            ADAFlag: this.addRevenueAsset.ADAFlag,
            HistoricPresrvFlag: this.addRevenueAsset.HistoricPresrvFlag

        }
        console.log(addData)
        console.log('delay replace age', this.addRevenueAsset.DelayReplaceAge);
        // this.addRevenueAsset.category = category;
        // this.updateAsset = {};

        this.$http.post('/api/users/asset/create/revenue', addData)
            .then(response => {
                console.log(response);
                if (response.data.returnValue === 0) {
                    this.$scope.updateTable('revenuevehicles');
                    this.addRevenueAsset = {};

                    $('#createAssetModal').modal('hide');
                    this.savingAssetSpinner = false;
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    createNonRevenueVehicle() {

        this.savingAssetSpinner = true;

        var addData = {

            ModeCode: this.addNonRevenueAsset.ModeCode,
            NTDModeCode: this.addNonRevenueAsset.NTDModeCode,
            AssetDesc: this.addNonRevenueAsset.AssetDesc,
            AgencyDetail: this.addNonRevenueAsset.AgencyDetail,
            AssetStatus: this.addNonRevenueAsset.AssetStatus,
            AssetType: this.addNonRevenueAsset.AssetType,
            YRBuilt: this.addNonRevenueAsset.YRBuilt,
            YRInService: this.addNonRevenueAsset.YRInService,
            AgencyUsefulLife: this.addNonRevenueAsset.AgencyUsefulLife,
            Quantity: this.addNonRevenueAsset.Quantity,
            UnitType: this.addNonRevenueAsset.UnitType,
            UnitCost: this.addNonRevenueAsset.UnitCost,
            AgencySoftCost: this.addNonRevenueAsset.AgencySoftCost,
            AgencyAssetUID: this.addNonRevenueAsset.AgencyAssetUID,
            PriorityStatus: this.addNonRevenueAsset.PriorityStatus,
            Manufacturer: this.addNonRevenueAsset.Manufacturer,
            ModelNumber: this.addNonRevenueAsset.ModelNumber,
            FuelType: this.addNonRevenueAsset.FuelType,
            AgencyCapitalResponsibility: this.addNonRevenueAsset.AgencyCapitalResponsibility,
            DelayReplaceAge: this.addNonRevenueAsset.DelayReplaceAge,
            LastRenewalYR: this.addNonRevenueAsset.LastRenewalYR,
            LastRenewalType: this.addNonRevenueAsset.LastRenewalType,
        }
        console.log(addData)

        this.$http.post('/api/users/asset/create/nonrevenue', addData)
            .then(response => {
                console.log(response);
                if (response.data.returnValue === 0) {
                    this.$scope.updateTable('nonrevenuevehicles');
                    this.addNonRevenueAsset = {};

                    $('#createAssetModal').modal('hide');
                    this.savingAssetSpinner = false;
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    createPassengerFacility() {

        this.savingAssetSpinner = true;
        console.log(this.addPassengerAsset);
        var addData = {

            ModeCode: this.addPassengerAsset.ModeCode,
            NTDModeCode: this.addPassengerAsset.NTDModeCode,
            AssetDesc: this.addPassengerAsset.AssetDesc,
            AgencyDetail: this.addPassengerAsset.AgencyDetail,
            AssetStatus: this.addPassengerAsset.AssetStatus,
            AssetType: this.addPassengerAsset.AssetType,
            YRBuilt: this.addPassengerAsset.YRBuilt,
            Quantity: this.addPassengerAsset.Quantity,
            UnitType: this.addPassengerAsset.UnitType,
            UnitCost: this.addPassengerAsset.UnitCost,
            AgencySoftCost: this.addPassengerAsset.AgencySoftCost,
            AgencyAssetUID: this.addPassengerAsset.AgencyAssetUID,
            PriorityStatus: this.addPassengerAsset.PriorityStatus,
            LastRenewalYR: this.addPassengerAsset.LastRenewalYR,
            LastRenewalType: this.addPassengerAsset.LastRenewalType,
            HistoricPresrvFlag: this.addPassengerAsset.HistoricPresrvFlag,
            DateofLastCondAssessment: this.addPassengerAsset.DateofLastCondAssessment,
            AgencyConditionRating: this.addPassengerAsset.AgencyConditionRating,
            AgencyCapitalResponsibility: this.addPassengerAsset.AgencyCapitalResponsibility,
            SquareFootage: this.addPassengerAsset.SquareFootage,
            AssetPhysAddress: this.addPassengerAsset.AssetPhysAddress,
            AssetPhysCity: this.addPassengerAsset.AssetPhysCity,
            AssetPhysState: this.addPassengerAsset.AssetPhysState,
            AssetPhysZIP: this.addPassengerAsset.AssetPhysZIP,
            Latitude: this.addPassengerAsset.Latitude,
            Longitude: this.addPassengerAsset.Longitude
        }
        console.log(addData)

        this.$http.post('/api/users/asset/create/passengerfacility', addData)
            .then(response => {
                console.log(response);
                if (response.data.returnValue === 0) {
                    this.$scope.updateTable('passengerfacilities');
                    this.$scope.type = ': Passenger Facilites';
                    this.addPassengerAsset = {};

                    $('#createAssetModal').modal('hide');
                    this.savingAssetSpinner = false;
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    createAdminMaintFacility() {

        this.savingAssetSpinner = true;
        console.log(this.addPassengerAsset);
        var addData = {

            ModeCode: this.addMAFacility.ModeCode,
            NTDModeCode: this.addMAFacility.NTDModeCode,
            AssetDesc: this.addMAFacility.AssetDesc,
            AgencyDetail: this.addMAFacility.AgencyDetail,
            AssetStatus: this.addMAFacility.AssetStatus,
            AssetType: this.addMAFacility.AssetType,
            YRBuilt: this.addMAFacility.YRBuilt,
            Quantity: this.addMAFacility.Quantity,
            UnitType: this.addMAFacility.UnitType,
            UnitCost: this.addMAFacility.UnitCost,
            AgencySoftCost: this.addMAFacility.AgencySoftCost,
            AgencyAssetUID: this.addMAFacility.AgencyAssetUID,
            PriorityStatus: this.addMAFacility.PriorityStatus,
            LastRenewalYR: this.addMAFacility.LastRenewalYR,
            LastRenewalType: this.addMAFacility.LastRenewalType,
            HistoricPresrvFlag: this.addMAFacility.HistoricPresrvFlag,
            DateofLastCondAssessment: this.addMAFacility.DateofLastCondAssessment,
            AgencyConditionRating: this.addMAFacility.AgencyConditionRating,
            AgencyCapitalResponsibility: this.addMAFacility.AgencyCapitalResponsibility,
            SquareFootage: this.addMAFacility.SquareFootage,
            AssetPhysAddress: this.addMAFacility.AssetPhysAddress,
            AssetPhysCity: this.addMAFacility.AssetPhysCity,
            AssetPhysState: this.addMAFacility.AssetPhysState,
            AssetPhysZIP: this.addMAFacility.AssetPhysZIP,
            Latitude: this.addMAFacility.Latitude,
            Longitude: this.addMAFacility.Longitude
        }
        console.log(addData)
        console.log('about to run the procedure');
        this.$http.post('/api/users/asset/create/adminmaintfacility', addData)
            .then(response => {
                console.log(response);
                if (response.data.returnValue === 0) {
                    this.$scope.updateTable('mandafacilities');
                    this.$scope.type = ': M&A Facilities';
                    this.addPassengerAsset = {};

                    $('#createAssetModal').modal('hide');
                    this.savingAssetSpinner = false;
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    createInfrastructure() {
        this.savingAssetSpinner = true;
        console.log(this.addInfrastructure);

        var addData = {
            AgencyAssetUID: this.addInfrastructure.AgencyAssetUID,
            AssetDesc: this.addInfrastructure.AssetDesc,
            AgencyDetail: this.addInfrastructure.AgencyDetail,
            AssetType: this.addInfrastructure.AssetType,
            ModeCode: this.addInfrastructure.ModeCode,
            NTDModeCode: this.addInfrastructure.NTDModeCode,
            Quantity: this.addInfrastructure.Quantity,
            UnitType: this.addInfrastructure.UnitType,
            UnitCost: this.addInfrastructure.UnitCost,
            AgencySoftCost: this.addInfrastructure.AgencySoftCost,
            YRBuilt: this.addInfrastructure.YRBuilt,
            YRInService: this.addInfrastructure.YRInService,
            AgencyUsefulLife: this.addInfrastructure.AgencyUsefulLife,
            DelayReplaceAge: this.addInfrastructure.DelayReplaceAge,
            Latitude: this.addInfrastructure.Latitude,
            Longitude: this.addInfrastructure.Longitude,
            AssetStatus: this.addInfrastructure.AssetStatus,
            AgencyCapitalResponsibility: this.addInfrastructure.AgencyCapitalResponsibility,
            PriorityStatus: this.addInfrastructure.PriorityStatus,
            LineDivision: this.addInfrastructure.LineDivision,
            BranchGarage: this.addInfrastructure.BranchGarage,
            SegmentRoute: this.addInfrastructure.SegmentRoute,
            LocLinearStart: this.addInfrastructure.LocLinearStart,
            LocLinearEnd: this.addInfrastructure.LocLinearEnd
        };
        console.log(addData);

        this.$http.post('/api/users/asset/create/infrastructure', addData)
            .then(response => {
                console.log(response);
                if (response.data.returnValue === 0) {
                    this.$scope.updateTable('infrastructure');
                    this.$scope.type = ': Infrastructure';
                    this.addInfrastructure = {};

                    $('#createAssetModal').modal('hide');
                    this.savingAssetSpinner = false;
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    createSystem() {
        console.log('saving system');
        this.savingAssetSpinner = true;
        // console.log(this.updateRevenueAsset);

        console.log(this.addSystems);


        var addData = {
            AgencyAssetUID: this.addSystems.AgencyAssetUID,
            AssetDesc: this.addSystems.AssetDesc,
            AgencyDetail: this.addSystems.AgencyDetail,
            AssetType: this.addSystems.AssetType,
            ModeCode: this.addSystems.ModeCode,
            NTDModeCode: this.addSystems.NTDModeCode,
            Quantity: this.addSystems.Quantity,
            UnitType: this.addSystems.UnitType,
            UnitCost: this.addSystems.UnitCost,
            AgencySoftCost: this.addSystems.AgencySoftCost,
            YRBuilt: this.addSystems.YRBuilt,
            YRInService: this.addSystems.YRInService,
            AgencyUsefulLife: this.addSystems.AgencyUsefulLife,
            DelayReplaceAge: this.addSystems.DelayReplaceAge,
            AssetPhysAddress: this.addSystems.AssetPhysAddress,
            AssetPhysCity: this.addSystems.AssetPhysCity,
            AssetPhysState: this.addSystems.AssetPhysState,
            AssetPhysZIP: this.addSystems.AssetPhysZIP,
            Latitude: this.addSystems.Latitude,
            Longitude: this.addSystems.Longitude,
            AssetStatus: this.addSystems.AssetStatus,
            PriorityStatus: this.addSystems.PriorityStatus,
        };
        console.log(addData);

        this.$http.post('/api/users/asset/create/system', addData)
            .then(response => {
                console.log(response);
                if (response.data.returnValue === 0) {
                    this.$scope.updateTable('systems');
                    this.$scope.type = ': System';
                    this.addSystems = {};

                    $('#createAssetModal').modal('hide');
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