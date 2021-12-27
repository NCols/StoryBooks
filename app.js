const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan'); // Logging module
const { engine } = require('express-handlebars'); // Our view engine, in the net nina tutorial we used ejs. Not sure yet why the brackets notation
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // Goal is to be able to save a session to the db, so that a user doesn't get disconnected when the server is restarted.
const connectDB = require('./config/db');



// Load config
dotenv.config({ path: './config/config.env' });

// Passport config
require('./config/passport')(passport); // Second 'passport' here is passing the const declared above as an argument for require

connectDB();

const app = express();

// Body parser middleware (to extract info from the POST form)
app.use(express.urlencoded({ extended: false}));
app.use(express.json());


// Logging
if (process.env.NODE_ENV == 'development') { // Only if in dev mode
    app.use(morgan('dev')) // This will print some info in the console when we're running app in dev mode
}

// Handlebars Helpers
const { formatDate, stripTags, truncate } = require('./helpers/hbs');

// Handlebars - more info on https://www.npmjs.com/package/express-handlebars
app.engine(
    '.hbs',
    engine({
        helpers: {
            formatDate,
            stripTags,
            truncate // We apply this helper to createdAt in dashboard.hbs
        },
      defaultLayout: 'main',
      extname: '.hbs',
    })
  )
app.set('view engine', '.hbs');

// Sessions - needs to come before passport middleware
app.use(session({
    secret: 'keyboard cat', // Aribtrary
    resave: false, // Don't save session unless anything is changed
    saveUninitialized: false, // Don't create a session unless anything is stored
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }) // Save a session to the db, so that a user doesn't get disconnected when the server is restarted.
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());



// Static folder
app.use(express.static(path.join(__dirname, 'public')));



// Routes
app.use('/', require('./routes/index')); // Transfers the handling of the request to the index.js router
app.use('/auth', require('./routes/auth')); // Transfers all routes starting with /auth to the auth.js router
app.use('/stories', require('./routes/stories'));


const PORT = process.env.PORT || 3000 // process.env allows to use variables that are stored in our config.

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    );