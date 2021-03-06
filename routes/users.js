/**===========================================

                IMPORT PACKAGE

**===========================================*/

/** import server package */
const express = require('express');
const router  = express.Router();

/** import database package */
const mongoose= require('mongoose');
const _ = require('lodash');

/** Import model */
var {User} = require('../models/user-model');

mongoose.Promise = global.Promise;
/**===========================================

              Body of User route

**===========================================*/

/** create new user */
router.post('/users',(req,res) => {

  //create an instant of new-user from input
  var input = _.pick(req.body,['email','password']);
  var newUser = new User(input);

  //save newUser to data
  User.Validate(newUser)
    .then(newUser => newUser.save())
    .then((user) => {
      return user.generateToken();
      })
    .then((token) => {
      res.status(200).header('x-auth',token).send(newUser);
      })
    .catch((err) => {
      res.status(400).send(err);
    })
})


/** login */
router.post('/users/login',(req,res) => {
  // get input from user
  var input = _.pick(req.body,['email','password']);

  // find corresponding user
  User.findByCredentials(input.email,input.password)
    .then((user) => {
      user.generateToken().then((token) =>{ //generate a token
        res.header('x-auth',token).send(user);
      });
    })
    .catch((err) =>{
      res.status(400).send(err);
    })
})


module.exports= router;
