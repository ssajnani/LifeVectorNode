const user = require('../models').user;
const cryptoHelper = require('../helpers/crypto');
const authlib = require('../libs/authlib');
var session = require('client-sessions');

function createUser (req, res){
    var user = {
        name: req.swagger.params.user.value.name,
        username: req.swagger.params.user.value.username,
        email: req.swagger.params.user.value.email,
        password: req.swagger.params.user.value.password
    };
    authlib.register(user, (error, result) => {
        if (error) {
            return res.status(400).json({error: error})
        } else {
            delete result.dataValues.hashed_pwd;
            delete result.dataValues.salt;
            req.session.user = result.username;
            return res.status(200).json({result: result.dataValues})
        }
    });
}

function login (req, res){
    var user = {
        username: req.swagger.params.user.value.username,
        password: req.swagger.params.user.value.password
    };
    cryptoHelper.checkSession(req, (sessBool) => {
        if (!sessBool) {
            authlib.login(user, (error, result) => {
                if (error) {
                    return res.status(400).json({error: error})
                } else {
                    req.session.user = result.username;
                    return res.status(200).json({result: result.result})
                }
            });
        } else {
            return res.status(400).json({error: "Already logged in."})
        }
    });
}

function logout (req, res){
    if (req.session.user) {
        var logoutUser = req.session.user;
        req.session.destroy();
        return res.clearCookie('Logout', {path: '/'}).status(200).json({message: logoutUser + " was successfully logged out."})
    } else {
        return res.status(400).json({message: "Not logged in."})
    }
}

function deleteUser (req, res) {
    cryptoHelper.checkSession(req, (sessBool) => {
       if (sessBool){
           authlib.deleteUser(req.swagger.params.user.value.username, (error, result) => {
               if(error) {
                   return res.status(400).json({error:error})
               } else {
                    var deleteUser = req.session.user;
                    req.session.destroy();
                    return res.clearCookie('Delete', {path: '/'}).status(200).json({message: deleteUser + " was successfully delete."})
               }
           });
       } else {
           return res.status(400).json({error: "Need to be signed in to delete a user."})
       }
    });

}

module.exports = {
    createUser: createUser,
    deleteUser: deleteUser,
    login: login,
    logout: logout
};
