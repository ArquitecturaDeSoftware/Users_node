const {User, validateUser, validateAuth} = require('../Models/users');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();



router.post('/', async (req, res) => {
  const { error } = validateAuth(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({name: req.body.name});
  if (!user) return res.status(400).send('Invalid email ');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid  password.');

  const token = jwt.sign({_id: user._id}, 'jwtPrivateKey')

  res.send(token);
});



module.exports = router;