var express = require('express');
var router = express.Router();
var csrf = require('csurf');

// setup route middlewares 
var csrfProtection = csrf({ cookie: false, value: (req)=>{ console.log(req);} });
/* GET home page. */
router.get('/', csrfProtection, function(req, res, next) {
  if(req.session){
    console.log(JSON.stringify(req.session));
    let sessionID1 = req.session.id;
    console.log(sessionID1);
    console.log("req.sessionID \n" + req.sessionID);
    console.log("req.\n" + req.session.csrfSecret);
  }
  //console.log("CSURF: \n" + csrfProtection.value(req) );
  res.render('index', { title: 'Express', csrfToken: req.csrfToken() });
});

module.exports = router;
