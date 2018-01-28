'use strict';

const i18next = require('i18next');
const i18nextMiddleware = require('i18next-express-middleware');
const Backend = require('i18next-node-fs-backend');

i18next
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
    backend: {
        loadPath: './locales/{{lng}}/{{ns}}.json',
        //addPath: __dirname + '/locales/{{lng}}/{{ns}}.missing.json'
    },
    //ns: ['es', 'en'],
    fallbackLng: 'en',
    preload: ['es', 'en'],
    saveMissing: true,
    // order and from where user language should be detected
    order: [/*'path', 'session', */ 'querystring', 'cookie', 'header'],
  
    // keys or params to lookup language from
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    lookupSession: 'lng',
    lookupPath: 'lng',
    lookupFromPathIndex: 1,
    
});

/** @module middleware/i18next */
module.exports = { 
    "i18next": i18next, 
    "i18nextMiddleware" : i18nextMiddleware.handle(i18next)
};