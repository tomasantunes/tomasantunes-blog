var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var secretConfig = require('./secret-config.json');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: secretConfig.SESSION_KEY,
  resave: false,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('tomasantunes-blog-frontend/build'));

// Frontend routes
app.get('/', (req,res) => {
  res.sendFile(path.resolve(__dirname) + '/tomasantunes-blog-frontend/build/index.html');
});

app.get('/about', (req, res) => {
  res.sendFile(path.resolve(__dirname) + '/tomasantunes-blog-frontend/build/index.html');
});

app.get('/contact', (req, res) => {
  res.sendFile(path.resolve(__dirname) + '/tomasantunes-blog-frontend/build/index.html');
});

app.get('/login', (req, res) => {
  res.sendFile(path.resolve(__dirname) + '/tomasantunes-blog-frontend/build/index.html');
});

app.get('/admin', (req, res) => {
  if(req.session.isLoggedIn) {
    res.sendFile(path.resolve(__dirname) + '/tomasantunes-blog-frontend/build/index.html');
  }
  else {
    res.redirect('/login');
  }
});

// Backend routes
app.post("/api/check-login", (req, res) => {
  var user = req.body.user;
  var pass = req.body.pass;
  
  if (user == secretConfig.USER && pass == secretConfig.PASS) {
    req.session.isLoggedIn = true;
    res.json({status: "OK", data: "Login successful."});
  }
  else {
    res.json({status: "NOK", data: "Login failed."});
  }
});

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
