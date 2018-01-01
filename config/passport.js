const { Strategy } = require('passport-google-oauth20');
const mongoose = require('mongoose');
const keys = require('./keys');

module.exports = (passport) => {
    passport.use(
        new Strategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true
        }, (accessToken, refreshToken, profile, cb) => {
            console.log(accessToken);
            console.log(profile);
        })
    )
}