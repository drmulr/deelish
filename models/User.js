const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise; //not essential, bug. Only need at start.js

const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

//make model:
const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid Email Address'],
        require: 'Please supply an email address'
    },
    name: {
        type: String,
        required: 'Please supply a name',
        trim: true
    }
});

//Passport Local Mongoose helps with password:
 userSchema.plugin(passportLocalMongoose, {
     usernameField: 'email'
 }); 
 userSchema.plugin(mongodbErrorHandler); //makes errors look nicer

module.exports = mongoose.model('User', userSchema);