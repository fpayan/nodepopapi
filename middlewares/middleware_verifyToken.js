'use strict';

const jwt = require('jsonwebtoken'),
utilRequest = require('../lib/utilRequest');

// exportamos un creador de middlewares de autenticación
/** @module middleware/token */
module.exports = ()=>{ 
    return function(req,res,next) {
    const token = req.body.token || req.query.token || req.get('x-access-token');
        if (token) {
        // verifies secret and checks credential
            jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
                if (err) { //failed verification.
                    if(utilRequest.isApi(req)){ // If is API call, return object to JSON.
                        return res.json({
                            "error": true
                        });
                    }else{ // Return <html>.
                        const error = new Error('Invalid token');
                        error.status = 401;
                        next(error);
                        return;
                    } // end secound if - utilRequest.
                }// end error verifies
                req.userId = decoded.user_id; // lo guardamos en el request para los siguientes middlewares
                next(); //no error, proceed
            });
        } else {
            // forbidden without token
            if(utilRequest.isApi(req)){
                return res.status(401).json({
                    "error": true,
                    message: "No token provided",
                    status: 401
                });
            }else{
                const err = new Error('No token provided');
                err.status = 401;
                next(err);
                return;
            }// end secound if - utilRequest.
        } // end if - token
    }// end return function.
}
