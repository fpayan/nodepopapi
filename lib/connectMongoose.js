'use strict';
//
require('dotenv').config();
//
const mongoose = require('mongoose');
const conn = mongoose.connection;
mongoose.Promise = global.Promise;
// require models
require('../models/user.model');
require('../models/announce.model');
// Events mongoose
// error - event
conn.on('error', err => {
  console.log('Error!', err);
  process.exit(1);
});
// open - event
conn.once('open', () => {
  console.log(`Conectado a MongoDB en ${mongoose.connection.name}`);
})
// Connect to db mongo
mongoose.connect(`${process.env.DB_CONNECT_MONGOOSE}${process.env.DB_NAME}`, {
  useMongoClient: true
});
// Export connection db
module.exports = conn;
