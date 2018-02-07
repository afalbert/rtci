'use strict';

import {User} from '../../sqldb';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import sqldb from '../../sqldb';

// console.log(sqldb.sequelize);



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
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({ token });
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
      if(!user) {
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
  return User.destroy({ where: { _id: req.params.id } })
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}

export function getTRSIDAssets(req, res){
  sqldb.sequelize.query("SELECT * FROM [aalbert].[RevenueVehicleInventory] WHERE TRSID ='" + 9013 + "'", { type: sqldb.sequelize.QueryTypes.SELECT})
  .then(assets => {
    if(!assets){
      return res.status(404).end();
    }
    // console.log(assets);
    res.json(assets);
    // We don't need spread here, since only the results will be returned for select queries
  })
  .catch(err => next(err));
}

export function getAssetsTotalCount(req, res){
  sqldb.sequelize.query("SELECT COUNT(AssetUID) AS count  FROM rtci_app.MainExportVw  WHERE (TRSID = 9013)", { type: sqldb.sequelize.QueryTypes.SELECT})
  .then(count => {
    if(!count){
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
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.find({
    where: {
      _id: userId
    }
  })
    .then(user => {
      if(user.authenticate(oldPass)) {
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
      'TRSID'
    ]
  })
    .then(user => { // don't ever give out the password or salt
      if(!user) {
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
