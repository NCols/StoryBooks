const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan'); // Logging module
const { engine } = require('express-handlebars'); // Our view engine, in the net nina tutorial we used ejs. Not sure yet why the brackets notation
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');



// Load config
dotenv.config({ path: './config/config.env' });

// Passport config
require('./config/passport')(passport); // Second 'passport' here is passing the const declared above as an argument for require

connectDB();

const app = express();

// Logging
if (process.env.NODE_ENV == 'development') { // Only if in dev mode
    app.use(morgan('dev')) // This will print some info in the console when we're running app in dev mode
}

// Handlebars - more info on https://www.npmjs.com/package/express-handlebars
app.engine(
    '.hbs',
    engine({
      defaultLayout: 'main',
      extname: '.hbs',
    })
  )
app.set('view engine', '.hbs');

// Sessions - needs to come before passport middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false, // Don't save session unless anything is changed
    saveUninitialized: false, // Don't create a session unless anything is stored
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());



// Static folder
app.use(express.static(path.join(__dirname, 'public')));



// Routes
app.use('/', require('./routes/index')); // Transfers the handling of the request to the index.js router
app.use('/auth', require('./routes/auth')); // Transfers all routes starting with /auth to the auth.js router


const PORT = process.env.PORT || 3000 // process.env allows to use variables that are stored in our config.

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    );