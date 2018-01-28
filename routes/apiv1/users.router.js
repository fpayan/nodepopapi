'use strict';

const express = require('express'),
    router = express.Router(),
    app = express();

const userController = require('../../controllers/users.controller');
const API_VERSION = '/apiv1';
const API_PATH_USER = '/user';

/** @module router/user */
module.exports = (app)=>{
    app.route(`${API_VERSION}${API_PATH_USER}/register`)
    .get(userController.register)
    .post(userController.register);

    app.route(`${API_VERSION}${API_PATH_USER}/login`)
    .get(userController.login)
    .post(userController.login);

    app.route(`${API_VERSION}${API_PATH_USER}/logout`)
    .get(userController.logout)
    .post(userController.logout);
};