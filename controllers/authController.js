const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');


exports.login = passport.authenticate('local', {
    failureRediret: '/login',
    failureFlash: 'Failed Login!',
    successRedirect: '/',
    successFlash: 'You are now logged in!'
});

exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You are now logged out!');
    res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
        return;
    }
    req.flash('error', 'Oops, you aren not logged in, so you cannot do that...');
    res.redirect('/login');
};

exports.forgot = async (req, res) => {
    //user exists?
    const user = await User.findOne({ email: req.body.email });
    if(!user) {
        req.flash('error', 'If account exists, email has been sent.');
        return res.redirect('/login');
    }
    //set reset tokens and expiry
     
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    //send email w/ token
    const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
    req.flash('success', `You have been emailed a password reset link. ${resetURL}`);
    //redirect to login page
    res.redirect('/login');
};

exports.reset = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
        req.flash('error', 'Password reset is invalid or has expired');
        return res.redirect('/login'); 
    };
    //if is user, show reset form:
    res.render('reset', { title: 'Reset Password' });
};

exports.confirmedPasswords = (req, res, next) => {
    if (req.body.password === req.body['password-confirm']) {
        next();
        return;
    }
    req.flash('error', 'Passwords do not match!');
    res.redirect('back');
}


exports.update = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
        req.flash('error', 'Password reset is invalid or has expired');
        return res.redirect('/login'); 
    };

    //need make promisify
    const setPassword = promisify(user.setPassword, user);
    await setPassword(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    const updatedUser = await user.save();
    await req.login(updatedUser);
    req.flash('success', 'Password reset.');
    res.redirect('/');
};