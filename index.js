const mongoose = require('mongoose');
const config = require('config');
const users = require('./routes/users');
const auth = require('./routes/auth');
const express = require('express');
const app = express();

if(!config.get('jwtPrivateKey')){
  console.log("ERROR FATAL, NO EXISTE LA VARIABLE PRIVADA DE TOKENS");
  process.exit(1);
}

mongoose.connect('mongodb:mongodb:27017')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/users', users);
app.use('/users/auth', auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));