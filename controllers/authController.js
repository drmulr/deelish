const passport = require('passport');

exports.login = passport.authenticate('local', {
    failureRediret: '/login',
    failureFlash: 'Failed Login!',
    successRedirect: '/',
    successFlash: 'You are now logged in!'
});