const user = require('../models').user;
const crypto = require('crypto');
const cryptoHelper = require('../helpers/crypto');

function login(username, password, callback){

}

function login(userJSON, callback){
    user
        .findOne({ where: {username: userJSON.username}})
        .then(userSearch => {
            if (userSearch) {
                var salt = userSearch.dataValues.salt;
                var hashing = cryptoHelper.hashPassword(userJSON.password, salt);
                if (hashing.hash.toString('base64') == userSearch.dataValues.hashed_pwd){
                    result = {
                        username: userJSON.username,
                        result: userJSON.username + " logged in successfully."
                    }
                    return callback(null, result)
                }
            }
            return callback("Username or password is incorrect. Please try again.")
        })
        .catch(error => {return callback(error.message)});
}

function register(userJSON, callback){
    var salt = crypto.randomBytes(128).toString();
    var hashing = cryptoHelper.hashPassword(userJSON.password, salt);
    user
        .findOne({ where: {username: userJSON.username}})
        .then(userSearch => {
            if (!userSearch) {
                return user.create({
                    name: userJSON.name,
                    username: userJSON.username,
                    email: userJSON.email,
                    hashed_pwd: hashing.hash.toString('hex'),
                    salt: hashing.salt
                })
                .then(user => {return callback(null, user)})
                .catch(error => {return callback(error.message)});
            } else {
                return callback("User with that username exists.")
            }
        })
        .catch(error => {return callback(error.message)});
}

function deleteUser(username, callback){
    user
        .findOne({ where: {username: username}})
        .then(user => {
            if (!user) {
                return callback('User not found');
            }
            return user
                .destroy()
                .then(() => {return callback(null, "User successfully deleted")})
                .catch(error => {return callback(error.message)});
        })
        .catch(error => {return callback(error.message)});
}

module.exports = {
    register:register,
    deleteUser: deleteUser,
    login: login
};






