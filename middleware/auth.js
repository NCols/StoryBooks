module.exports = {
    ensureAuth: function(req, res, next) { // Again 'next' here is an arbitrary name for the function that's going to run next
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/');
        }
    },
    ensureGuest: function (req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/dashboard');
        } else {
            return next();
        }
    }
}