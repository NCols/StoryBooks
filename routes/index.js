const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');

const Story = require('../models/Story'); // Bring in db model for stories

// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    });
});

// @desc    Dashboard page
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id }).lean() // lean() -> docs returned from queries are plain js objects, not mongoose documents
        res.render('dashboard',{
            name: req.user.firstName,
            stories
        });
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
    
});


module.exports = router;