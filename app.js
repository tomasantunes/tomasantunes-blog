var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var secretConfig = require('./secret-config.json');
var mysql = require('mysql2');

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

function connectDB() {
  var con = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'tomasantunes_blog',
  });
  con.connect(function(err) {
      if (err) {
          console.log("MySQL is not connected.");
          throw err;
      }
      console.log("Connected to MySQL!");
  });
  return con;
}

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

app.get('/admin/posts', (req, res) => {
  if(req.session.isLoggedIn) {
    res.sendFile(path.resolve(__dirname) + '/tomasantunes-blog-frontend/build/index.html');
  }
  else {
    res.redirect('/login');
  }
});

app.get('/admin/new-post', (req, res) => {
  if(req.session.isLoggedIn) {
    res.sendFile(path.resolve(__dirname) + '/tomasantunes-blog-frontend/build/index.html');
  }
  else {
    res.redirect('/login');
  }
});

app.get('/admin/edit-post/:post_id', (req, res) => {
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

app.get("/api/get-posts", (req, res) => {
  var con = connectDB();
  var sql = "SELECT * FROM posts;";
  con.query(sql, function(err, result) {
    if (err) {
      res.json({status: "NOK", error: err.message});
    }
    else {
      res.json({status: "OK", data: result});
    }
  });
});

app.post("/api/add-post", (req, res) => {
  var title = req.body.title;
  var content = req.body.content;
  var tags = req.body.tags;
  var slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  var con = connectDB();
  var sql = "INSERT INTO posts (title, slug, content, tags) VALUES (?, ?, ?, ?);";
  con.query(sql, [title, slug, content, tags], function(err, result) {
    if (err) {
      res.json({status: "NOK", error: err.message});
    }
    else {
      res.json({status: "OK", data: result});
    }
  });
});

app.get("/api/get-post/:slug", (req, res) => {
  var slug = req.params.slug;

  var con = connectDB();
  var sql = "SELECT * FROM posts WHERE slug = ?;";
  con.query(sql, [slug], function(err, result) {
    if (err) {
      res.json({status: "NOK", error: err.message});
    }
    else {
      res.json({status: "OK", data: result[0]});
    }
  });
});

app.post("/api/delete-post", (req, res) => {
  var post_id = req.body.post_id;

  var con = connectDB();
  var sql = "DELETE FROM posts WHERE id = ?;";
  con.query(sql, [post_id], function(err, result) {
    if (err) {
      res.json({status: "NOK", error: err.message});
    }
    else {
      res.json({status: "OK", data: result});
    }
  });
});

app.get("/api/get-post-by-id/:post_id", (req, res) => {
  var post_id = req.params.post_id;

  var con = connectDB();
  var sql = "SELECT * FROM posts WHERE id = ?;";
  con.query(sql, [post_id], function(err, result) {
    if (err) {
      res.json({status: "NOK", error: err.message});
    }
    else {
      res.json({status: "OK", data: result[0]});
    }
  });
});

function getChildrenComments(comments, parent_id) {
  var children = [];
  for (var i = 0; i < comments.length; i++) {
    if (comments[i].parent_id == parent_id && comments[i].parent_id != 0) {
      children.push(comments[i]);
    }
  }
  return children;
}

app.get("/api/get-comments/:post_id", (req, res) => {
  var post_id = req.params.post_id;

  var con = connectDB();
  var sql = "SELECT * FROM comments WHERE post_id = ?;";
  con.query(sql, [post_id], function(err, result) {
    if (err) {
      res.json({status: "NOK", error: err.message});
    }
    else {
      var comments = [];
      for (var i = 0; i < result.length; i++) {
        var comment = result[i];
        comment.children = getChildrenComments(result, comment.id);
        if (comment.parent_id == 0) {
          comments.push(comment);
        }
      }
      res.json({status: "OK", data: comments});
    }
  });
});

app.post("/api/add-comment", (req, res) => {
  var post_id = req.body.post_id;
  var parent_id = req.body.parent_id;
  var author = req.body.author;
  var content = req.body.content;

  var con = connectDB();
  var sql = "INSERT INTO comments (post_id, parent_id, author, content) VALUES (?, ?, ?, ?);";
  con.query(sql, [post_id, parent_id, author, content], function(err, result) {
    if (err) {
      res.json({status: "NOK", error: err.message});
    }
    else {
      res.json({status: "OK", data: result});
    }
  });
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
