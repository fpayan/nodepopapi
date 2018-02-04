'use strict';

const jwt = require('jsonwebtoken');
const userModel = require('mongoose').model('User');
const daoUser = require('../database/dao/users.dao');
//
const validate = require('express-validation');
const Joi = require('joi');

module.exports.validateLoginFields = async (req, res, next)=>{
    let schemaValidateName = {
        loginPassword: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
        loginEmail: Joi.string().email().required()
    }

    let resultValidateName = Joi.validate(req.body, schemaValidateName, { stripUnknown: false, abortEarly: false, allowUnknown: true });
    //

    resultValidateName
        .then((value)=>{
            next();
        })
        .catch((err)=>{
          let arr_errors = [];
          let obj = JSON.stringify(err);
          let objParse = JSON.parse(obj);
          Object.entries(objParse["details"]).forEach( ( [key, element] ) => {
            arr_errors.push(element.path, element.message);
          });
          
        res.status(402).json({
          success: false,
          message: arr_errors
        });
    });
}

/**@module controller/user */
/**
 * @description Login user from web or api version.
 *
 * URL valid:
 * /apiv2/user/register/web - HTML method GET or POST
 * /apiv2/user/register - API  method POST
 *
 * @param { request } req - Request http object
 * @param { response } res - Response http object
 * @param { next } next - Middledware for next call method
 */
module.exports.login = async (req, res, next)=>{
    daoUser.findUserToAutentication(req, res, next);
};

module.exports.indexApp = async (req, res, next)=>{
    // setup route middlewares
    //var csrfProtection = csrf( { cookie: false} );

    res.render('index', { title: 'Express', csrfToken: req.csrfToken() });
}
