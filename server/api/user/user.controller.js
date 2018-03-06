'use strict';

import {
    User
} from '../../sqldb';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import sqldb from '../../sqldb';

// console.log(sqldb.sequelize);

var sql = require("mssql");
console.log(config.mssql.config);
console.log(process.env.SQL_USER);






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
    return function(err) {
        return res.status(statusCode).json(err);
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function(err) {
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
        .then(function(user) {
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
        .then(function() {
            res.status(204).end();
        })
        .catch(handleError(res));
}

export function getTRSIDAssets(req, res) {
    sqldb.sequelize.query("SELECT * FROM [aalbert].[RevenueVehicleInventory] WHERE TRSID ='" + 9013 + "'", {
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
    console.log(category);
    var query;
    if (category === 'nonrevenuevehicles') {
        query = "SELECT * FROM [aalbert].[NonRevenueVehicleInventory] WHERE TRSID ='9013'";
    } else if (category === 'mandafacilities') {
        query = "SELECT * FROM [aalbert].[MandAFacilitiesInventory] WHERE TRSID ='9013'";
    } else if (category === 'passengerfacilities') {
        query = "SELECT * FROM [aalbert].[PassengerFacilitiesInventory] WHERE TRSID ='9013'";
    } else if (category === 'revenuevehicles') {
        query = "SELECT * FROM [aalbert].[RevenueVehicleInventory] WHERE TRSID ='9013'";
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
    sqldb.sequelize.query("SELECT COUNT(AssetUID) AS count  FROM rtci_app.MainExportVw  WHERE (TRSID = 9013)", {
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
    sql.connect(config.mssql.config, function(err) {

        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
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
        request.input('StdUsefulLife', sql.Int, req.body.StdUsefulLife);
        request.input('Quantity', sql.Float, req.body.Quantity);
        request.input('UnitType', sql.VarChar(20), req.body.UnitType);
        request.input('AgencySoftCost', sql.Float, req.body.AgencySoftCost);
        request.input('TotalCost', sql.Money, req.body.TotalCost);
        request.input('YRCost', sql.Int, req.body.YRCost);
        request.input('AssetPhysAddress', sql.NVarChar(255), req.body.AssetPhysAddress);
        request.input('AssetPhysZIP', sql.NChar(5), req.body.AssetPhysZIP);
        request.input('LineDivision', sql.NVarChar(50), req.body.LineDivision);
        request.input('BranchGarage', sql.NVarChar(50), req.body.BranchGarage);
        request.input('SegmentRoute', sql.NVarChar(50), req.body.SegmentRoute);
        request.input('LocLinearStart', sql.NVarChar(50), req.body.LocLinearStart);
        request.input('LocLinearEnd', sql.NVarChar(50), req.body.LocLinearEnd);
        request.input('AgencyAssetUID', sql.NVarChar(50), req.body.AgencyAssetUID);
        request.input('AgencyAssetClass', sql.NVarChar(50), req.body.AgencyAssetClass);
        request.input('AgencyDeptOwner', sql.NVarChar(255), req.body.AgencyDeptOwner);
        request.input('AgencyNotes', sql.NVarChar(4000), req.body.AgencyNotes);
        request.input('AgencyConditionRating', sql.Numeric(2, 1), req.body.AgencyConditionRating);
        request.input('AgencyParentUID', sql.NVarChar(50), req.body.AgencyParentUID);
        request.input('AgencyProjNum', sql.NVarChar(50), req.body.AgencyProjNum);
        request.input('AgencyProjCat', sql.NVarChar(50), req.body.AgencyProjCat);
        request.input('AgencyProjDesc', sql.NVarChar(255), req.body.AgencyProjDesc);
        request.input('AgencySubFleetID', sql.NVarChar(50), req.body.AgencySubFleetID);
        request.input('RevenueFlag', sql.Bit, req.body.RevenueFlag);
        request.input('PriorityStatus', sql.Int, req.body.PriorityStatus);
        request.input('TCPScore', sql.Int, req.body.TCPScore);
        request.input('SquareFootage', sql.Numeric(18, 2), req.body.SquareFootage);
        request.input('HistoricPresrvFlag', sql.Bit, req.body.HistoricPresrvFlag);
        request.input('ItemizedFlag', sql.Bit, req.body.ItemizedFlag);
        request.input('Manufacturer', sql.NVarChar(50), req.body.Manufacturer);
        request.input('ManufacturerCode', sql.NChar(3), req.body.ManufacturerCode);
        request.input('ModelNumber', sql.NVarChar(50), req.body.ModelNumber);
        request.input('FuelType', sql.NVarChar(3), req.body.FuelType);
        request.input('CapacitySeated', sql.Char(2), req.body.CapacitySeated);
        request.input('CapacityStanding', sql.Int, req.body.CapacityStanding);
        request.input('DataYR', sql.Int, req.body.DataYR);
        request.input('DataSRC', sql.VarChar(50), req.body.DataSRC);
        request.input('RTCICycle', sql.Char(5), req.body.RTCICycle);
        request.input('ReviewFlag', sql.Bit, req.body.ReviewFlag);
        request.input('ApprovedFlag', sql.Bit, req.body.ApprovedFlag);
        request.input('ApprovalComment', sql.NVarChar(4000), req.body.ApprovalComment);
        request.input('DelayReplaceAge', sql.Int, req.body.DelayReplaceAge);
        request.input('Rehabed', sql.Bit, req.body.Rehabed);
        request.input('RehabedDate', sql.Date, req.body.RehabedDate);


        // request.output('AssetUID', sql.Int)
        request.execute('dbo.updateAsset', (err, result) => {
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


    });


}

/**
 * Visualizations for Dashboard
 */
export function getPAOUL(req, res) {
    sqldb.sequelize.query("SELECT * FROM [aalbert].[PAOUL] WHERE TRSID = " + 9013, {
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
    sqldb.sequelize.query("SELECT * FROM [aalbert].[AssetCategories] WHERE TRSID = " + 9013, {
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
    sqldb.sequelize.query("SELECT * FROM [aalbert].[NumRevenueVehicles] WHERE TRSID = " + 9013, {
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
    sqldb.sequelize.query("SELECT * FROM [aalbert].[AssetCost] WHERE TRSID = " + 9013, {
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