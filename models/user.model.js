'use stric';

const mongoose = require('mongoose');
Schema = mongoose.Schema;

/**
 * @type {Object}
 */
const UserSchema = new Schema({
    name: {
        type: String, lowercase: true, 
        required: [true, 'Name is required']
    },
    age: { 
      type: Number, 
      min: 18, 
      max: 100 
    },
    email: {
        type: String, 
        lowercase: true, 
        trim: true, 
        match: [/.+\@.+\..+/, "Please fill a valid e-mail address"],
        required: [true, 'Email is required'], 
        unique: true, 
        index: true
    },
    password: {
        type: String, 
        required: [true, 'Password is required']
    },
    announces: [{ type: Schema.Types.ObjectId, ref: 'Announce' }],
    role: {
      type:[
          {
            type: String,
            enum: ["Admin", "OwnUser", "Client"],
            default: 'Client'
          }
      ]      
    },
    created: {
      type: Date,
      default: new Date()
    },
    update: {
      type: Date,
      default: new Date()
    }
});


  // Compare password input to password saved in database
  UserSchema.methods.comparePassword = function(pw, cb) {
    
  };

  /** @module model/user */
module.exports = mongoose.model('User', UserSchema);

