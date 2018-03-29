'use strict';

import { Router } from 'express';
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
router.put('/:id/asset', auth.isAuthenticated(), controller.updateAsset);
router.put('/:id/asset/nonrevenue', auth.isAuthenticated(), controller.updateNonRevenueVehicle)
router.put('/:id/asset/passengerfacility', auth.isAuthenticated(), controller.updatePassengerFacility);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.put('/:id/account', auth.isAuthenticated(), controller.changeAccountInfo);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);

module.exports = router;