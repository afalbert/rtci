'use strict';

import {
  User
} from '../../sqldb';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import sqldb from '../../sqldb';

// console.log(sqldb.sequelize);

var sql = require("mssql");
console.log(config);


// console.log(config.mssql.config);
// console.log(process.env.SQL_USER);

// sql.connect(config.mssql.config, function (err) {

//   if (err) console.log(err);


// });




// // create Request object
// var request = new sql.Request(config.mssql.config);

// // query to the database and get the records
// request.query('select TOP(1000) * from rtci_app.RTCIAssetInventory', function(err, recordset) {

//     if (err) console.log(err);
//     console.log(recordset);

//     // send records as a response
//     // res.send(recordset);

// });

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function (err) {
    return res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    return res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  return User.findAll({
      attributes: [
        '_id',
        'name',
        'email',
        'role',
        'provider',
        'FirstName',
        'LastName',
        'TRSID'
      ]
    })
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res) {
  var newUser = User.build(req.body);
  newUser.setDataValue('provider', 'local');
  newUser.setDataValue('role', 'user');
  return newUser.save()
    .then(function (user) {
      var token = jwt.sign({
        _id: user._id
      }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({
        token
      });
    })
    .catch(validationError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  return User.find({
      where: {
        _id: userId
      }
    })
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.destroy({
      where: {
        _id: req.params.id
      }
    })
    .then(function () {
      res.status(204).end();
    })
    .catch(handleError(res));
}

export function getTRSIDAssets(req, res) {
  var trsid = req.user.dataValues.TRSID;
  // const request = new sql.Request();

  // const request = new sql.Request(config.mssql);
  // console.log('about to run query');
  // request.query("SELECT * FROM [aalbert].[RevenueVehicleInventory] WHERE TRSID = " + trsid, function (err, recordset) {

  //   if (err) console.log(err);
  //   if (!recordset) {
  //     return res.status(404).end();
  //   }
  //   console.log(recordset[0]);

  //   // send records as a response
  //   res.json(recordset);

  // });




  sqldb.sequelize.query("SELECT * FROM [aalbert].[RevenueVehicleInventory] WHERE TRSID = " + trsid, {
      type: sqldb.sequelize.QueryTypes.SELECT
    })
    .then(assets => {
      if (!assets) {
        return res.status(404).end();
      }
      // console.log(assets);
      res.json(assets);
      // We don't need spread here, since only the results will be returned for select queries
    })
    .catch(err => next(err));
}

export function getTRSIDCategoryAssets(req, res) {
  var category = req.params.category;
  var trsid = req.user.dataValues.TRSID;

  console.log(category);
  var query;
  if (category === 'nonrevenuevehicles') {
    query = "SELECT * FROM [aalbert].[NonRevenueVehicleInventory] WHERE TRSID = " + trsid;
  } else if (category === 'mandafacilities') {
    query = "SELECT * FROM [aalbert].[MandAFacilitiesInventory] WHERE TRSID = " + trsid;
  } else if (category === 'passengerfacilities') {
    query = "SELECT * FROM [aalbert].[PassengerFacilitiesInventory] WHERE TRSID = " + trsid;
  } else if (category === 'revenuevehicles') {
    query = "SELECT * FROM [aalbert].[RevenueVehicleInventory] WHERE TRSID = " + trsid;
  }

  console.log(query);
  sqldb.sequelize.query(query, {
      type: sqldb.sequelize.QueryTypes.SELECT
    })
    .then(assets => {
      if (!assets) {
        return res.status(404).end();
      }
      // console.log(assets);
      res.json(assets);
      // We don't need spread here, since only the results will be returned for select queries
    })
    .catch(err => next(err));
}

export function getAssetsTotalCount(req, res) {
  var trsid = req.user.dataValues.TRSID;

  sqldb.sequelize.query("SELECT COUNT(AssetUID) AS count  FROM rtci_app.MainExportVw  WHERE (TRSID = " + trsid + ")", {
      type: sqldb.sequelize.QueryTypes.SELECT
    })
    .then(count => {
      if (!count) {
        return res.status(404).end();
      }
      res.json(count);
    })
    .catch(err => next(err));
}

export function getAssetStatusSummary(req, res) {
  sqldb.sequelize.query("Select * from dbo.AssetStatusSummary_VW", {
      type: sqldb.sequelize.QueryTypes.SELECT
    })
    .then(count => {
      console.log(count);
      if (!count) {
        return res.status(404).end();
      }
      res.json(count);
    })
    .catch(err => next(err));
}

/**
 * Change a users password
 */
export function changePassword(req, res) {
  console.log(req.body);
  console.log(req.user._id);
  var userId = req.user._id;
  var oldPass = String(req.body.old);
  var newPass = String(req.body.new);

  return User.find({
      where: {
        _id: userId
      }
    })
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Change a users password
 */
export function changeAccountInfo(req, res) {
  console.log(req.body);
  var userId = req.user._id;
  var FirstName = String(req.body.FirstName);
  var LastName = String(req.body.LastName);
  var email = String(req.body.email);
  var PhoneBusiness = String(req.body.PhoneBusiness);
  var PhoneCell = String(req.body.PhoneCell);


  return User.find({
      where: {
        _id: userId
      }
    })
    .then(user => {
      user.FirstName = FirstName;
      user.LastName = LastName;
      user.email = email;
      user.PhoneBusiness = PhoneBusiness;
      user.PhoneCell = PhoneCell;

      return user.save()
        .then(() => {
          res.status(204).end();
        })
        .catch(validationError(res));

    });
}

/**
 * Update single asset
 */

export function updateAsset(req, res) {
  console.log(req.body);


  // // connect to your database
console.log('additonal  support',req.body.AdditionalModeSupport);
console.log('historic flag',req.body.HistoricPresrvFlag);
console.log('ada flag',req.body.ADAFlag);

  // create Request object
  var request = new sql.Request(config.mssql);
  request.input('AssetUID', sql.Int, req.body.AssetUID);
  request.input('ModeCode', sql.NVarChar(3), req.body.ModeCode);
  request.input('NTDModeCode', sql.NChar(2), req.body.NTDModeCode);
  request.input('AssetDesc', sql.NVarChar(500), req.body.AssetDesc);
  request.input('AgencyDetail', sql.NVarChar(500), req.body.AgencyDetail);
  request.input('AssetStatus', sql.VarChar(3), req.body.AssetStatus);
  request.input('AssetType', sql.Numeric(18, 6), req.body.AssetType);
  request.input('YRBuilt', sql.Int, req.body.YRBuilt);
  request.input('YRInService', sql.Date, req.body.YRInService);
  request.input('AgencyUsefulLife', sql.Int, req.body.AgencyUsefulLife);
  request.input('Quantity', sql.Float, req.body.Quantity);
  request.input('UnitCost', sql.VarChar(20), req.body.UnitCost);
  request.input('AgencySoftCost', sql.Float, req.body.AgencySoftCost);
  request.input('AgencyAssetUID', sql.NVarChar(50), req.body.AgencyAssetUID);
  request.input('PriorityStatus', sql.Int, req.body.PriorityStatus);
  request.input('HistoricPresrvFlag', sql.Bit, req.body.HistoricPresrvFlag);
  request.input('AdditionalModeSupport', sql.Bit, req.body.AdditionalModeSupport);
  request.input('ADAFlag', sql.Bit, req.body.ADAFlag);
  request.input('RVID', sql.NVarChar(255), req.body.RVID);
  request.input('Manufacturer', sql.NVarChar(50), req.body.Manufacturer);
  request.input('ManufacturerCode', sql.NChar(3), req.body.ManufacturerCode);
  request.input('ModelNumber', sql.NVarChar(50), req.body.ModelNumber);
  request.input('FuelType', sql.NVarChar(3), req.body.FuelType);
  request.input('CapacitySeated', sql.Char(2), req.body.CapacitySeated);
  request.input('CapacityStanding', sql.Int, req.body.CapacityStanding);
  request.input('DelayReplaceAge', sql.Int, req.body.DelayReplaceAge);
  request.input('LastRenewalYR', sql.Int, req.body.LastRenewalYR);
  request.input('LastRenewalType', sql.Int, req.body.LastRenewalType);
  request.input('PercentContingencyFleet', sql.Int, req.body.PercentContingencyFleet);


  // request.output('AssetUID', sql.Int)
  request.execute('dbo.updateRevenueVehicles', (err, result) => {
    // ... error checks
    if (err) {
      console.log(err);
      sql.close();
    } else {
      console.log(result);
      // console.log(result.recordsets.length) // count of recordsets returned by the procedure
      // console.log(result.recordsets[0].length) // count of rows contained in first recordset
      // console.log(result.recordset) // first recordset from result.recordsets
      // console.log(result.returnValue) // procedure return value
      // console.log(result.output) // key/value collection of output values
      // console.log(result.rowsAffected) // array of numbers, each number represents the number of rows affected by executed statemens
      res.json(result);
      sql.close();
      // ...
    }
  })




}

/**
 * Visualizations for Dashboard
 */
export function getPAOUL(req, res) {
  // console.log(req.user);
  var trsid = req.user.dataValues.TRSID;

  sqldb.sequelize.query("SELECT * FROM [aalbert].[PAOUL] WHERE TRSID = " + trsid, {
      type: sqldb.sequelize.QueryTypes.SELECT
    })
    .then(assets => {
      if (!assets) {
        return res.status(404).end();
      }
      // console.log(assets);
      res.json(assets);
      // We don't need spread here, since only the results will be returned for select queries
    })
    .catch(err => next(err));
}

export function getAssetCategories(req, res) {
  var trsid = req.user.dataValues.TRSID;

  sqldb.sequelize.query("SELECT * FROM [aalbert].[AssetCategories] WHERE TRSID = " + trsid, {
      type: sqldb.sequelize.QueryTypes.SELECT
    })
    .then(assets => {
      if (!assets) {
        return res.status(404).end();
      }
      // console.log(assets);
      res.json(assets);
      // We don't need spread here, since only the results will be returned for select queries
    })
    .catch(err => next(err));
}

export function totalAssets(req, res) {
  var trsid = req.user.dataValues.TRSID;

  sqldb.sequelize.query("SELECT * FROM [aalbert].[NumRevenueVehicles] WHERE TRSID = " + trsid, {
      type: sqldb.sequelize.QueryTypes.SELECT
    })
    .then(assets => {
      if (!assets) {
        return res.status(404).end();
      }
      // console.log(assets);
      res.json(assets);
      // We don't need spread here, since only the results will be returned for select queries
    })
    .catch(err => next(err));
}

export function getAssetReplacementCost(req, res) {
  var trsid = req.user.dataValues.TRSID;

  sqldb.sequelize.query("SELECT * FROM [aalbert].[AssetCost] WHERE TRSID = " + trsid, {
      type: sqldb.sequelize.QueryTypes.SELECT
    })
    .then(assets => {
      if (!assets) {
        return res.status(404).end();
      }
      // console.log(assets);
      res.json(assets);
      // We don't need spread here, since only the results will be returned for select queries
    })
    .catch(err => next(err));
}

export function getTargetSettingPAOUL(req, res) {
  console.log(req.user);
  var trsid = req.user.dataValues.TRSID;

  var queryString;
  queryString = "SELECT * FROM [aalbert].[TargetSettingPAOULMaster] WHERE TRSID = " + trsid;

  sqldb.sequelize.query(queryString, {
      type: sqldb.sequelize.QueryTypes.SELECT
    })
    .then(assets => {
      if (!assets) {
        return res.status(404).end();
      }
      // console.log(assets);
      res.json(assets);
      // We don't need spread here, since only the results will be returned for select queries
    })
    .catch(err => next(err));
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  return User.find({
      where: {
        _id: userId
      },
      attributes: [
        '_id',
        'name',
        'email',
        'role',
        'provider',
        'FirstName',
        'LastName',
        'TRSID',
        'PhoneCell',
        'PhoneBusiness'
      ]
    })
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res) {
  res.redirect('/');
}
