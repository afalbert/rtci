'use strict';

import {
    Router
} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/targets/paoul', auth.isAuthenticated(), controller.getTargetSettingPAOUL);
router.get('/dashboard/paoul', auth.isAuthenticated(), controller.getPAOUL);
router.get('/dashboard/assetReplacementCost', auth.isAuthenticated(), controller.getAssetReplacementCost);
router.get('/dashboard/assetCategories', auth.isAuthenticated(), controller.getAssetCategories);
router.get('/dashboard/totalAssets', auth.isAuthenticated(), controller.totalAssets);
router.get('/getAssets/assetSummary', auth.isAuthenticated(), controller.getAssetStatusSummary);
router.get('/getAssets/:category', auth.isAuthenticated(), controller.getTRSIDCategoryAssets);
router.get('/getAssets', auth.isAuthenticated(), controller.getTRSIDAssets);
router.get('/getAssets/Total', auth.isAuthenticated(), controller.getAssetsTotalCount);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:type/asset', auth.isAuthenticated(), controller.updateAsset);
router.put('/:type/asset/nonrevenue', auth.isAuthenticated(), controller.updateNonRevenueVehicle)
router.put('/:type/asset/passengerfacility', auth.isAuthenticated(), controller.updatePassengerFacility);
router.put('/:type/asset/adminmaintfacility', auth.isAuthenticated(), controller.updateAdminMaintFacility);
router.put('/:type/asset/infrastructure', auth.isAuthenticated(), controller.updateInfrastructure);
router.put('/:type/asset/system', auth.isAuthenticated(), controller.updateSystem);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.put('/:id/account', auth.isAuthenticated(), controller.changeAccountInfo);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/asset/create/revenue', auth.isAuthenticated(), controller.createRevenueVehicle);
router.post('/asset/create/nonrevenue', auth.isAuthenticated(), controller.createNonRevenueVehicle);
router.post('/asset/create/passengerfacility', auth.isAuthenticated(), controller.createPassengerFacility);
router.post('/asset/create/adminmaintfacility', auth.isAuthenticated(), controller.createAdminMaintFacility);
router.post('/asset/create/infrastructure', auth.isAuthenticated(), controller.createInfrastructure);
router.post('/asset/create/system', auth.isAuthenticated(), controller.createSystem);
router.post('/', auth.isAuthenticated(), controller.create);

module.exports = router;