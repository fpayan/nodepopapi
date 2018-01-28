'use strict';

module.exports.login = async (req, res, next)=>{
    res.render('login', {
        success: true
    });
};

module.exports.singup = async (req, res, next)=>{
    res.render('singup', {
        success: true
    });
};