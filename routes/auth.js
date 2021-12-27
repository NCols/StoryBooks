const express = require('express');
const passport = require('passport');
const router = express.Router();

// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
})); // We use the 'google' strategy to authenticate, cf https://www.passportjs.org/packages/passport-google-oauth20/. 

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/'  // If it fails, redirect to home '/'
    }),
    (req, res) => {
        res.redirect('/dashboard');  // If it succeeds, redirect to dashboard
    });

// @desc    Logout user
// @route /auth/logout
router.get('/logout', (req, res) => {
    req.logout(); // When logged in, we have a logout method on the request
    res.redirect('/');
});


module.exports = router;