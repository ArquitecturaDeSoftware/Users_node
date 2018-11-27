const Joi = require('joi');
const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
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
  }));

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