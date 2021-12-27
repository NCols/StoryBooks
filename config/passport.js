const GoogleStrategy = require('passport-google-oauth20').Strategy // See https://www.passportjs.org/packages/passport-google-oauth20/ for more info on using passport with Google OAuth 2.0
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback'
        },
        async (accessToken, refreshToken, profile, whenDone) => {
            // What happens when we validate the Google account to log in with (in dev we just print the profile in the console)
            // console.log(profile);
            const newUser = {
                googleId: profile.id,
                displayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: profile.photos[0].value
            };

            try {
                let user = await User.findOne({ googleId: profile.id })
                if (user) {
                    whenDone(null, user);
                } else {
                    user = await User.create(newUser);
                    whenDone(null, user);
                }
            } catch (error) {
                console.log(err);
            }
        })),
    
    passport.serializeUser((user, whenDone) => {
        whenDone(null, user.id);
    }),

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
    })
         
};