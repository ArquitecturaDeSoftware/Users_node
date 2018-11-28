const {User, validateAuth} = require('../Models/users');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();



router.post('/', async (req, res) => {
  const { error } = validateAuth(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({name: req.body.name});
  if (!user) return res.status(400).send('Invalid email.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid  password.');

  const token = user.generateAuthToken();

  res.send(token);
});



router.get('/verifyToken', async (req, res) => {
  const token = req.header('x-auth-token');
  if(!token) res.status(401).send('No se ingresó token válido');
  
  try {
    const payload = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = payload;
    res.send(true);
  } catch (error) {
    res.status(400).send('Token inválido.');
  }
});


module.exports = router;