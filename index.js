const mongoose = require('mongoose');
const config = require('config');
const users = require('./routes/users');
const auth = require('./routes/auth');
const express = require('express');
const app = express();
const soap = require('soap');
const http = require('http');
const bodyParser = require('body-parser');
const { User } = require('./Models/users');


if (!config.get('jwtPrivateKey')) {
  console.log("ERROR FATAL, NO EXISTE LA VARIABLE PRIVADA DE TOKENS");
  process.exit(1);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// mongoose.connect('mongodb://mongodb:27017')
mongoose.connect('mongodb://localhost:27017')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));


app.use(express.json());
app.use('/users', users);
app.use('/users/auth', auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));


var service = {
  checkUserWService: {
    checkUserPort: {
      checkUser: async (args, callback) => {
        const users = await User.findOne({ cedula: args.cedula });
        console.log(users.cedula);
        console.log(users.name);
        console.log(users.lunchroom_id);
        console.log(users.active_ticket);
        callback({
          cedula: args.cedula,
          name: users.name,
          lunchroom_id: users.lunchroom_id,
          active_ticket: users.active_ticket
        })
      }
    }
  }
};


var xml = require('fs').readFileSync('checkUser.wsdl', 'utf8');
var server = http.createServer(function (request, response) {
  response.end("404: Not Found: " + request.url);
});
server.listen(8001);

async function p () {
  await soap.listen(server, '/checkUser', service, xml);
}

p()



