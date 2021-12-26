const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan'); // Logging module
const { engine } = require('express-handlebars'); // Our view engine, in the net nina tutorial we used ejs. Not sure yet why the brackets notation
const connectDB = require('./config/db');

// Load config
dotenv.config({ path: './config/config.env' });

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

// Static folder
app.use(express.static(path.join(__dirname, 'public')));



// Routes
app.use('/', require('./routes/index')); // Transfers the handling of the request to the router index.js

const PORT = process.env.PORT || 3000 // process.env allows to use variables that are stored in our config.

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    );