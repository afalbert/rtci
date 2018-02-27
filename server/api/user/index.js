'use strict';

import { Router } from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/getAssets/assetSummary', auth.isAuthenticated(), controller.getAssetStatusSummary);
router.get('/getAssets/:category', auth.isAuthenticated(), controller.getTRSIDCategoryAssets);
router.get('/getAssets', auth.isAuthenticated(), controller.getTRSIDAssets);
router.get('/getAssets/Total', auth.isAuthenticated(), controller.getAssetsTotalCount);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/asset', auth.isAuthenticated(), controller.updateAsset);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.put('/:id/account', auth.isAuthenticated(), controller.changeAccountInfo);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);

module.exports = router;