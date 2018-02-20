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
            return res.status(404).json({error: error})
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
    authlib.login(user, (error, result) => {
        if (error) {
            return res.status(404).json({error: error})
        } else {
            req.session.user = result.username;
            return res.status(200).json({result: result.result})
        }
    });
}

function logout (req, res){
    var user = {
        username: req.swagger.params.user.value.username,
        password: req.swagger.params.user.value.password
    };
    req.session.destroy();
}

function deleteUser (req, res) {
    console.log(req.session.user);
    cryptoHelper.checkSession(req, res, (session) => {
       if (session){
           authlib.deleteUser(req.swagger.params.user.value.username, (error, result) => {
               if(error) {
                   return res.status(404).json({error:error})
               } else {
                   return res.status(200).json({result: result})
               }
           });
       } else {
           return res.status(404).json({error: "Need to be signed in to delete a user."})
       }
    });

}

module.exports = {
    createUser: createUser,
    deleteUser: deleteUser,
    login: login
};
