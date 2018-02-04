const express = require('express');
const helmet = require('helmet');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const i18next = require('./middlewares/middleware_i18n');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//
app.use(helmet());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(sassMiddleware({
//   src: path.join(__dirname, 'public'),
//   dest: path.join(__dirname, 'public'),
//   indentedSyntax: true, // true = .sass and false = .scss
//   sourceMap: true
// }));
app.use(express.static(path.join(__dirname, 'public')));
//
// i18next for all request
app.use(i18next.i18nextMiddleware);
// Load Connect DB
require('./lib/connectMongoose');
//
//-momery unleaked---------
app.set('trust proxy', 1);
//
app.use(session({
    secret: 'nodepopapiKeepcoding2018version1',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      path: "/",
      maxAge:  60 * 60 * 60 //30 mins
    },
    // store: new MongoStore({ url: '<mongoose connection url>'  })

}));

var index = require('./routes/index');
var users = require('./routes/users');

// Controllers
require('./controllers/users.api.controllers');

// Routers
require('./routes/api/users.router')(app);

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
