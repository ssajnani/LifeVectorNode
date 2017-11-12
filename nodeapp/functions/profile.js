'use strict';
 
const user = require('../models/user');
 
exports.getProfile = email => 
 
    new Promise((resolve,reject) => {
 
        user.find({ username: username }, { name: 1, username: 1, email: 1 })
 
        .then(users => resolve(users[0]))
 
        .catch(err => reject({ status: 500, message: 'Internal Server Error !' }))
 
    });
