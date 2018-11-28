const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  cedula: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  lunchroom_id: {
    type: String,
    minlength: 0
  },
  active_ticket: {
    type: String,
    minlength: 0
  },
  password: {
    type: String,
    minlength: 0,
    minimize: false
  }  
});

userSchema.methods.generateAuthToken = function(){
  const token = jwt.sign({_id: this._id}, config.get('jwtPrivateKey'));
  return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
      name: Joi.string(),
      cedula: Joi.string(),
      lunchroom_id: Joi.string(),
      active_ticket: Joi.string(),
      password: Joi.string()
    };
  
    return Joi.validate(user, schema);
  }

  function validateAuth(user) {
    const schema = {
      name: Joi.string(),
      password: Joi.string()
    };
  
    return Joi.validate(user, schema);
  }

  exports.User = User;
  exports.validateUser = validateUser;
  exports.validateAuth = validateAuth;