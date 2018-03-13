'use strict';
const crypto = require('crypto');
const User = require('../models').user;
exports.hashPassword = function(password, salt) {
    var iterations = 10000;
    var hash = crypto.pbkdf2Sync(password, salt, iterations, 125, 'sha512');
    return {
        salt: salt,
        hash: hash,
        iterations: iterations
    };
};

exports.checkSession = function (req, callback) {
    if (req.session && req.session.user) {
        User
            .findOne({ where: {username: req.session.user}})
            .then(user => {
                if (user) {
                    req.session.user = user.dataValues.username;
                }
                // finishing processing the middleware and run the routes
                callback(true);
            });
    } else {
        callback(false);
    }
}
