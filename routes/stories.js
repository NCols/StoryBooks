const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');

const Story = require('../models/Story'); // Bring in db model for stories

// @desc    Show add story page
// @route   GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add');
});

// @desc    Process add form
// @route   POST /stories
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id  // req.body gives us the data from the form, but requires middleware to be able to use. Here we take the user id param that's embedded in the request, and add it to our req.body
        await Story.create(req.body)
        res.redirect('/dashboard');
    } catch (err) {
        console.log(err);
        res.render('error/500');
    }
});

// @desc    Show all public stories
// @route   GET /stories
router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: 'public'})
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean() // so that we can pass it to our template
        
        res.render('stories/index', {
            stories
        })
    } catch (err) {
        console.log(err);
        res.render('/error/500');
    }
});

module.exports = router;