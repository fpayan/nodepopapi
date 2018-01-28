'use strict';

const jwt = require('jsonwebtoken');
const userModel = require('mongoose').model('User');
const daoUser = require('../database/dao/users.dao'); 
const utilRequest = require('../lib/utilRequest');


function validate_Email_User_For_Login_Html(req){
    let _email = req.body.email,
        _isValid = false;

    if(req.body.email === undefined || req.body.email === null || req.body.email === ''){
        _isValid = false;
        return _isValid;
    }else{
        _isValid = true;
        return _isValid;
    }
}

function validate_Password_User_For_Login_Html(req){
    let _password = req.body.password,
        _isValid = false;

    if(req.body.password === undefined || req.body.password === null || req.body.password === ''){
        _isValid = false;
        return _isValid;
    }else{
        _isValid = true;
        return _isValid;
    }
}


/**@module controller/user */
/**
 * @description Regiter user from web - <HTML> or api - JSON version.
 * 
 * URL valid:
 * /apiv2/user/register/web - HTML method GET or POST
 * /apiv2/user/register - API HTML method POST
 * 
 * @param { request } req - Request http object 
 * @param { response } res - Response http object
 * @param { next } next - Middledware for next call method 
 */
module.exports.register = (req, res, next)=>{
    console.log('Method :', req.method);
    // URL have /web on path ?
    if(utilRequest.isRegisterWeb(req) && req.method === 'GET'){
        // Yes it's! - response format HTML
        res.render('index', {title: "Register for user", msg: "Register for user"});
    }
    else if(!utilRequest.isRegisterWeb(req) && req.method === 'GET'){
        res.render('index', {title: "Register for user", msg: "Register for user"});
    }
    else if(!utilRequest.isRegisterWeb(req) && req.method === 'POST'){
        // User want register into system from API method.
        return daoUser.createUser(req, res, next);
    }
    else{
        res.render('index', {title: "Register for user", msg: "Register for user"});
    }
};

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
    let _msgError = '';
    
    if(req.body.cross){
        // Validar email y pass
        if(validate_Email_User_For_Login_Html(req) && validate_Password_User_For_Login_Html(req)){
            
            daoUser.findUserToAutentication(req, res, next);

        }else{
            _msgError = req.t('USER_NOT_FOUND') || 'User not found';
            return res.status(401).render('login',{
                success: false,
                message: _msgError
            });
        }
    }
    else if( ! req.body.cross ){ // Not validate user and not cross
        if(validate_Email_User_For_Login_Html(req) && validate_Password_User_For_Login_Html(req)){
            
            daoUser.findUserToAutentication(req, res, next);

        }else{
            _msgError = req.t('USER_NOT_FOUND') || 'User not found';
            return res.status(401).render('login',{
                success: true,
                message: _msgError
            });
        }
            
        }
    else{
        return res.render('login', {
            success: true,
            message: ''
        });

    }
};

/**@module controller/user */
/**
 * @description Logout user from web or api version.
 * 
 * URL valid:
 * /apiv2/user/register/web - HTML method GET or POST
 * /apiv2/user/register - API HTML method POST
 * 
 * @param { request } req - Request http object 
 * @param { response } res - Response http object
 * @param { next } next - Middledware for next call method 
 */
module.exports.logout =async (req, res, next)=>{
    let _msgToken = '';
    // URL have /web on path ?
    if( utilRequest.isRegisterWeb(req) && req.method === 'GET' ){
        // Yes it's! - response format HTML
        res.render('index', {title: "Logout for user", msg: "Logout for user"});
    }
    else if( !utilRequest.isRegisterWeb(req) && req.method === 'GET' ){
        res.render('index', {title: "Logout for user", msg: "Logout for user"});
    }
    else if( !utilRequest.isRegisterWeb(req) && req.method === 'POST' ){
        // response status 200 success: false (token not match) or status 200 success: true
        _msgToken = req.t('TOKEN_DELETED') || 'Token has deleted';
        if(req.body.token){
            return res.status(200).json({
                success: true,
                token: null,
                message: _msgToken
            });
        }
        return res.status(200).json({
            success: false,
            token: null,
            message: _msgToken
        });
    }
    else{
        res.render('index', {title: "Logout for user", msg: "Logout for user"});
    }
};

let userAuthenticate = async (_emailCheck, _passCheck)=>{

}

/**@module controller/user */
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


module.exports.hasAuthorization = async(req, res, next)=>{

};
