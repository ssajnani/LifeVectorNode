'use strict';
 
const mongoose = require('mongoose');
 
const Schema = mongoose.Schema;
 
const userSchema = mongoose.Schema({ 
 
    email            : String, 
    username         : String,
    hashed_password    : String,
    created_at        : String,
    temp_password    : String,
    temp_password_time: String
 
});
 
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://ssajnani:lviefcetor@ds117819.mlab.com:17819/lifevector');
 
module.exports = mongoose.model('user', userSchema);
