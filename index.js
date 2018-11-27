const mongoose = require('mongoose');
const users = require('./routes/users');
const auth = require('./routes/auth');
const express = require('express');
const app = express();

mongoose.connect('mongodb://localhost:27017')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/users', users);
app.use('/users/auth', auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));