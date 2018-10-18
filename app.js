var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// to use the .env file variables
require('dotenv').config();

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var exerciseRouter = require('./routes/exercise');

// Connect to mongodb database
const mongoose = require('mongoose')
//mongoose.connect('mongodb://admin:exercisesquid101@ds235022.mlab.com:35022/exercise-tracker' )
mongoose.connect(process.env.MONGO_URI)
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to database');
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Add imported route-handling code to the request handling chain
app.use('/api/exercise/add', exerciseRouter);
app.use('/api/exercise', userRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
