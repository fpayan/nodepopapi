'use strict';

const express = require('express'),
router = express.Router(),
app = express();

const announceController = require('../../controllers/announces.controller');
const API_VERSION = '/apiv1',
    API_OBJECT_NAME = '/announce';

/** @module router/announce */
module.exports = (app)=>{
    
    app.route(`${API_VERSION}${API_OBJECT_NAME}`) // /apiv?/announce
    .get(announceController.requiresLogin, announceController.listAllAnnounce)
    .post(announceController.requiresLogin, announceController.listAllAnnounce);

    app.route(`${API_VERSION}${API_OBJECT_NAME}/tag/:name?/:limit?/:skip?/:select?`) // /apiv?/announce/tags
    .get(announceController.requiresLogin, announceController.listByQueryAnnounce)
    .post(announceController.requiresLogin, announceController.listByQueryAnnounce);
    
    app.route(`${API_VERSION}${API_OBJECT_NAME}/create/:name?/:text?/:price?/:sales?/:url?/:tag?/:user?`) // /apiv?/announce/create
    .get(announceController.requiresLogin, announceController.createAnnounce)
    .post(announceController.requiresLogin, announceController.createAnnounce);
    
    app.route(`${API_VERSION}${API_OBJECT_NAME}/update/:name?/:text?/:price?/:sales?/:url?/:tag?/:user?`) // /apiv?/announce/update
    .put(announceController.requiresLogin, announceController.updateAnnounce)
    .post(announceController.requiresLogin, announceController.updateAnnounce);
    
    app.route(`${API_VERSION}${API_OBJECT_NAME}/delete/:name?/:text?/:price?/:sales?/:url?/:tag?/:user?`) // /apiv?/announce/delete
    .put(announceController.requiresLogin, announceController.deleteAnnounce)
    .post(announceController.requiresLogin, announceController.deleteAnnounce);
    
    app.route(`${API_VERSION}${API_OBJECT_NAME}/user/:id?`) // /apiv?/announce/name (announce sort name)
    .get(announceController.requiresLogin, announceController.userListAllOwnAnnounces) // warning danger id user show in url. relax it's only one sample
    .post(announceController.requiresLogin, announceController.userListAllOwnAnnounces);

    app.route(`${API_VERSION}${API_OBJECT_NAME}/user/:?`) // /apiv?/announce/name (announce sort name)
    .get(announceController.requiresLogin)
    .post(announceController.requiresLogin);

    app.route(`${API_VERSION}${API_OBJECT_NAME}/name/:web?`) // /apiv?/announce/name (announce sort name)
    .get(announceController.requiresLogin)
    .post(announceController.requiresLogin);

    app.route(`${API_VERSION}${API_OBJECT_NAME}/search`)
    .post(announceController.requiresLogin, announceController.searchAnnouncesByQuery);
};