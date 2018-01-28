'use strict';

const jwt = require('jsonwebtoken');
const announceModel = require('mongoose').model('Announce');
const utilRequest = require('../lib/utilRequest');
const i18next = require('../middlewares/middleware_i18n');
const daoAnnounce = require('../database/dao/announce.dao');

// Return query format req.query or req.params
/**
 * @description For full object json with params for query filter in announce dao.
 * 
 * @returns { function } - Functions which return a json object with all fields of necessary for query filters in announce dao. 
 */
const objParamsFilter = {
    queryFields: async (req, res, next)=> {
        return {
            _filter : req.query.filter || req.params.filter || req.body.filter, // { field1 : 'Name title' } or { filed1: { $eq: 'Na' }}
            _limit : parseInt(req.query.limit) || parseInt(req.params.limit) || parseInt(req.body.limit), // Number
            _skip : parseInt(req.query.skip) || parseInt(req.params.skip) || parseInt(req.body.skip), // Number
            _sort : req.query.sort || req.params.sort || req.body.sort, // { field: -1, field2: 1 }
            _fields : req.query.fields || req.params.fields || req.body.fields, // { field1: 1, field2: 1}
        }
    }
};

/**@module controller/announce */
/**
 * List all record for doc Announce
 * 
 * Call method dao of Announce and get all announces in doc.
 * 
 * @param { request } req - Request http object 
 * @param { response } res - Response http object
 * @param { next } next - Middledware for next call method
 */
module.exports.listAllAnnounce = (req, res, next)=>{
    let name = req.query.name || req.body.name || req.params.name;
    let tag = req.query.tag || req.body.tag || req.params.tag;
    let price = req.query.price || req.body.price || req.params.price;
    let sales = req.query.sales || req.body.sales || req.params.sales;
    let start = parseInt(req.query.start) || parseInt(req.body.start) || parseInt(req.params.start);
    let limit = parseInt(req.query.limit) || parseInt(req.body.limit) || parseInt(req.params.limit);
    let sort = req.query.sort || req.body.sort || req.params.sort;

    let filter = {};

    if(name){
        filter.nameArticle = name;
    }
    if(age){
        filter.age = age;
    }
    if(sales){
        filter.salesAnnounce = sales;
    }
    if(price){
        filter.price = price;
    }
    if(tag){
        filter.tags = tag;
    }

    daoAnnounce.findAllAnnounce(req, res, next, 
        filter, limit, skip, sort);    
};

/**@module controller/announce */
/**
 * List all record which match with the filters params
 * 
 * @description Call method dao of Announce and get all announces in doc by filters param.
 * 
 * @param { request } req - Request http object 
 * @param { response } res - Response http object
 * @param { next } next - Middledware for next call method
 */
module.exports.listByQueryAnnounce = (req, res, next)=>{
    let queryAnnounce = objParamsFilter.queryFields(req, res, next);
    daoAnnounce.findByQueryAnnounce(req, res, next, queryAnnounce._filter, queryAnnounce._limint, queryAnnounce._skip, queryAnnounce._sort, queryAnnounce._fields);
};

/**@module controller/announce */
/**
 * Create new announce.
 * 
 * @description Call method dao of Announce and get all announces in doc by filters param.
 * 
 * @param { request } req - Request http object 
 * @param { response } res - Response http object
 * @param { next } next - Middledware for next call method
 * 
 * @returns { [ Announce ] } - Return array with Announce find in db mongo.  
 */
module.exports.createAnnounce = (req, res, next)=>{
    daoAnnounce.createAnnounce(req, res, next);
};

/**@module controller/announce */
module.exports.updateAnnounce = (req, res, next)=>{
    daoAnnounce.updateAnnounce(req, res, next);
};

/**@module controller/announce */
module.exports.deleteAnnounce = (req, res, next)=>{
    daoAnnounce.deleteAnnounce(req, res, next);
};

/**@module controller/announce */
module.exports.userListAllOwnAnnounces = (req, res, next)=>{
    daoAnnounce.userListAllOwnAnnounces(req, res, next);
}

/**@module controller/announce */
/**
 * @description Middleware for controller search request from method POST only.
 * 
 * @param { request } req - Request http object 
 * @param { response } res - Response http object
 * @param { next } next - Middledware for next call method 
 * 
 * @returns { [Announces] } Array of Announces if exist o Array empty.
 */
module.exports.searchAnnouncesByQuery = async (req, res, next)=>{
    //let dataSearch = objParamsFilter.queryFields(req, res, next);
    daoAnnounce.searchAnnouncesByQuery(req, res, next)
}


/**@module controller/announce */
/**
 * @description Middleware for controller token's user at every request
 * 
 * @param { request } req - Request http object 
 * @param { response } res - Response http object
 * @param { next } next - Middledware for next call method 
 * 
 * @returns { Object } Objeto javascript with data showing token's user not exist.
 */
module.exports.requiresLogin =async (req, res, next)=>{
    const token = req.body.token || req.query.token || req.get('x-access-token');
    let _msgError = '';
    if (token) {
    // verifies secret and checks credential
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) { //failed verification.
                _msgError = req.t('FAILED_AUTH') || 'Invalid token';
                res.format({
                    http: ()=>{
                        return res.status(401).render('login',{
                                success:false,
                                message: _msgError
                            });
                    },
                    json: ()=>{
                        return res.render('login',{
                            success:false,
                            message: _msgError
                        });
                        // return res.status(401).json({
                        //         success:false,
                        //         message: _msgError
                        //     });
                    }
                });
            }// end error verifies
            req.user_id = decoded.id; // save user_id into request object for next request validations. (middlewares)
            next(); //no error, proceed
        });
    } else {
        // forbidden without token
        _msgError = req.t('FAILED_AUTH') || 'Invalid token';
        res.format({
            http: ()=>{
                return res.render('login',{
                        success: "false",
                        message: _msgError
                    });
            },
            json: ()=>{
                res.type('html');
                return res.render('login',{
                    success: false,
                    message: _msgError
                }, (err, html)=>{
                    console.log(err);
                    res.status(401).send(html);
                });
            }
        });
    } // end if - token
};// end requiresLogin function.
