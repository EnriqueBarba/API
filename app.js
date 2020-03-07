require('dotenv').config()

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

require('./config/db.config');

const session = require('./config/session.config');
const cors = require('./config/cors.config')

/**
 * Configure express
 */
const app = express();
app.use(cors)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session);
app.use((req, _, next) => {
  console.log('REQUEST ', req.session)
  req.currentUser = req.session.user
  next()
})

/**
 * Configure routes
 */
const router = require('./config/routes.js');
app.use('/', router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (error, req, res, next) {
    console.error('-' * 1000)
    console.error(error);
  
    res.status(error.status || 500);
  
    const data = {}
  
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400);
  
      for (field of Object.keys(error.errors)) {
        error.errors[field] = error.errors[field].message
      }
      data.errors = error.errors
    } else if (error instanceof mongoose.Error.CastError) {
      error = createError(404, 'Resource not found')
    }
  
    data.message = error.message;
    res.json(data);
  });
  
  /** 
   * Listen on provided port
   */
  const port = process.env.PORT || '3001';
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
