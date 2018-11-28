const {User, validateUser} = require('../Models/users');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();



router.get('/:cedula', async (req, res) => {
  const users = await User.findOne({cedula : req.params.cedula});

  if (!users) return res.status(404).send('The user with the given cedula was not found.');

  res.send(_.pick(users, ['_id', 'cedula', 'name', 'lunchroom_id', 'active_ticket']));
});

router.post('/', async (req, res) => {
  const { error } = validateUser(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = new User( 
    _.pick(req.body, ['cedula', 'name', 'lunchroom_id', 'active_ticket','password'])
  );
  
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user = await user.save();
  
  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'cedula', 'name', 'lunchroom_id', 'active_ticket']));
});

router.put('/:id', async (req, res) => {
  const { error } = validateUser(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    _.pick(req.body, ['active_ticket']) ,
   {new: true}
   );

  if (!user) return res.status(404).send('The user with the given ID was not found.');
  
  res.send("Updated");
});

router.delete('/:id', async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user) return res.status(404).send('The user with the given ID was not found.');

  res.send("Deleted");
});



module.exports = router;