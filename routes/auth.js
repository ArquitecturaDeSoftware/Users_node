const { User, validateAuth } = require('../Models/users');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();


// --------------------------------LDAP------------------------

const ldapjs = require('ldapjs');
const Promise = require('bluebird');
const assert = require('assert');

const ldapOptions = {
  url: 'ldap://35.231.46.158:389',
  timeout: 100000,
  connectTimeout: 10000,
  reconnect: true
};

// let connect = () => {
//   const ldapOptions = {
//     url: 'ldap://35.231.46.158:389',
//     timeout: 100000,
//     connectTimeout: 10000,
//     reconnect: true
//   };
//   const ldapClient = ldapjs.createClient(ldapOptions);
//   const access = ldapClient.bind('cn=admin,dc=arqsoft,dc=una,dc=edu,dc=co', 'admin', function(err) {
//     if (err){
//       console.log("error");
//     }else{
//       console.log("normal");
//     }
//   });
// }


// let authenticate = (userId, password) => {
//   const ldapClient = ldapjs.createClient(ldapOptions);
//   return new Promise((resolve, reject) => {
//     ldapClient.bind(
//       "cn=" + userId + ",ou=academy,dc=arqsoft,dc=unal,dc=edu,dc=co",
//       password,
//       (err, res) => {
//         if (err) {
//           //@see https://github.com/mcavage/node-ldapjs/blob/7059cf6b8a0b4ff4c566714d97f3cef04f887c3b/test/client.test.js @ 305
//           return reject(err);
//         }
//         ldapClient.unbind();
//         return resolve(res);
//       }
//     );
//   })
// };

// console.log(authenticate('geologia@unal.edu.co', '$2a$10$GovRY7guCM76tB/qfsW6DunhyI/t8.CYgUT/4uM3j/Dcyht1XiRtS'));


// --------------------------------LDAP------------------------


router.post('/', async (req, res) => {
  const ldapClient = ldapjs.createClient(ldapOptions);
  const access = ldapClient.bind(
    'cn=admin,dc=arqsoft,dc=unal,dc=edu,dc=co',
    'admin',
    async function (err) {
      if (err) {
        res.send("Primera conexión rechazada");
      } else {
        
        const { error } = validateAuth(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({ name: req.body.name });
        if (!user) return res.status(400).send('Invalid email.');

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).send('Invalid  password.');

        ldapClient.bind(
          "cn=" + user.name + ",ou=academy,dc=arqsoft,dc=unal,dc=edu,dc=co",
          user.password,
          function (err) {
            if (err) {
              res.send("Usuario no registrado en LDAP pero si en la base de datos");
            } else {
              const token = user.generateAuthToken();
              res.send(token);
              ldapClient.unbind();
            }
          }
        );
      }
    });
});



router.get('/verifyToken', async (req, res) => {
  const token = req.header('x-auth-token');
  if (!token) res.status(401).send('No se ingresó token válido');

  try {
    const payload = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = payload;
    res.send(true);
  } catch (error) {
    res.status(400).send('Token inválido.');
  }
});


module.exports = router;