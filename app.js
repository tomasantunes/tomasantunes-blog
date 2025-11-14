var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var secretConfig = require('./secret-config.json');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var useragent = require('express-useragent');

var indexRouter = require('./routes/index');
var viewsRouter = require('./routes/views');
var analyticsRouter = require('./routes/analytics');
var filesRouter = require('./routes/files');
var exportRouter = require('./routes/export');
var postsRouter = require('./routes/posts');
var commentsRouter = require('./routes/comments');
var imagesRouter = require('./routes/images');
var authRouter = require('./routes/auth');
var searchRouter = require('./routes/search');
var externalRouter = require('./routes/external');

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

app.use(fileUpload({
  createParentPath: true
}));

app.use(useragent.express());

app.disable('etag');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('frontend/dist'));

app.use('/', indexRouter);
app.use('/', viewsRouter);
app.use('/', analyticsRouter);
app.use('/', filesRouter);
app.use('/', exportRouter);
app.use('/', postsRouter);
app.use('/', commentsRouter);
app.use('/', imagesRouter);
app.use('/', authRouter);
app.use('/', searchRouter);
app.use('/', externalRouter);

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
