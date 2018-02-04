'use strict';

const express = require('express'),
  //router = express.Router(),
  app = express();
const csrf = require('csurf');
const userController = require('../../controllers/users.api.controllers');
const API_ROOT = '/api';
//const API_PATH_USER = '/user';

module.exports = (app)=>{

  // setup route middlewares
  var csrfProtection = csrf( { cookie: false} );
  // Method GET url / root app
  app.route(`${API_ROOT}`)
  .get(csrfProtection, userController.indexApp)
  .post( (req, res)=>{
    res.send("HELP ME !! POST");
  });

  // Method POST login user.
  app.route(`${API_ROOT}/login`)
  .post(userController.validateLoginFields, userController.login);
}
