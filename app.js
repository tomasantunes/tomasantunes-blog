var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var secretConfig = require('./secret-config.json');
var mysql = require('mysql2');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var escape = require('escape-html');
const { lookup } = require('geoip-lite');
var useragent = require('express-useragent');
var config = require('./config');

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
app.use(express.static('tomasantunes-blog-frontend/build'));

var con = mysql.createPool({
      connectionLimit : 90,
      host: secretConfig.DB_HOST,
      user: secretConfig.DB_USER,
      password: secretConfig.DB_PASSWORD,
      database: secretConfig.DB_NAME,
});

// Analytics routes
app.get("/api/analytics/page-entry", (req, res) => {
  var fullUrl = req.query.fullUrl;
  var dt = new Date().toISOString().slice(0, 19).replace('T', ' ');
  var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (ip.substr(0, 7) == "::ffff:") {
    ip = ip.substr(7)
  }
  var location = lookup(ip);
  if (location == null) {
    location = "N/A";
  }
  var ua = req.useragent;
  var operating_system = ua.os;
  var browser = ua.browser;
  var browser_version = ua.version;

  var sql = "INSERT INTO analytics (page_url, entry_time, ip_address, country, operating_system, browser, browser_version) VALUES (?, ?, ?, ?, ?, ?, ?);";
  con.query(sql, [fullUrl, dt, ip, location, operating_system, browser, browser_version], function (err, result) {
    if (err) {
      console.log(err);
    }
  });
});

app.get("/api/analytics/exit-page", (req, res) => {
  var fullUrl = req.query.fullUrl;
  var dt = new Date().toISOString().slice(0, 19).replace('T', ' ');
  var dt_today = new Date().toISOString().slice(0, 10);
  var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (ip.substr(0, 7) == "::ffff:") {
    ip = ip.substr(7)
  }

  console.log(fullUrl);
  console.log(dt);
  console.log(ip);
  console.log(dt_today);

  var sql = "UPDATE analytics SET exit_time = ? WHERE page_url = ? AND ip_address = ? AND entry_time LIKE ?;";
  con.query(sql, [dt, fullUrl, ip, '%' + dt_today + '%'], function (err, result) {
    if (err) {
      console.log(err);
    }
    res.json({status: "OK"});
  });
});

// Frontend routes
app.get('/', (req,res) => {
  res.sendFile(path.resolve(__dirname) + '/tomasantunes-blog-frontend/build/index.html');
});

app.get('/blog-post/:slug', (req,res) => {
  res.sendFile(path.resolve(__dirname) + '/tomasantunes-blog-frontend/build/index.html');
});

app.get('/about', (req, res) => {
  res.sendFile(path.resolve(__dirname) + '/tomasantunes-blog-frontend/build/index.html');
});

app.get('/contact', (req, res) => {
  res.sendFile(path.resolve(__dirname) + '/tomasantunes-blog-frontend/build/index.html');
});

app.get('/search-results/:query', (req, res) => {
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

  var sql = "SELECT * FROM logins WHERE is_valid = 0 AND created_at > (NOW() - INTERVAL 1 HOUR);";

  con.query(sql, function (err, result) {
    if (result.length <= 5) {
      if (user == secretConfig.USER && pass == secretConfig.PASS) {
        req.session.isLoggedIn = true;
        var sql2 = "INSERT INTO logins (is_valid) VALUES (1);";
        con.query(sql2);
        res.json({status: "OK", data: "Login successful."});
      }
      else {
        var sql2 = "INSERT INTO logins (is_valid) VALUES (0);";
        con.query(sql2);
        res.json({status: "NOK", error: "Wrong username/password."});
      }
    }
    else {
      res.json({status: "NOK", error: "Too many login attempts."});
    }
  });
  
  
});

app.get("/api/get-posts", (req, res) => {
  var offset = req.query.offset;
  var limit = req.query.limit;
  var sql = "SELECT p.title AS post_title, p.summary, p.tags, p.slug, p.created_at, pi.title AS image_title, pi.filename AS image_filename FROM posts AS p LEFT JOIN preview_images AS pi ON p.id = pi.post_id ORDER BY p.id DESC LIMIT ? OFFSET ?;";
  var sql2 = "SELECT COUNT(*) AS countresult FROM posts;";
  con.query(sql, [Number(limit), Number(offset)], function(err, result) {
    if (err) {
      res.json({status: "NOK", error: err.message});
    }
    else {
      con.query(sql2, function(err2, result2) {
        res.json({status: "OK", data: {posts: result, count: result2[0].countresult}});
      });
    }
  });
});

app.get("/api/get-all-posts", (req, res) => {
  var sql = "SELECT * FROM posts ORDER BY id DESC;";
  con.query(sql, function(err, result) {
    if (err) {
      res.json({status: "NOK", error: err.message});
    }
    else {
      res.json({status: "OK", data: result});
    }
  });
});

app.get("/api/search/:query", (req, res) => {
  var query = req.params.query;
  var sql = "SELECT * FROM posts WHERE title LIKE '%" + query + "%' OR content LIKE '%" + query + "%' OR tags LIKE '%" + query + "%';";
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
  if (req.session.isLoggedIn) {
    var title = req.body.title;
    var content = req.body.content;
    var tags = req.body.tags;
    var summary = req.body.summary;
    var slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    var sql = "INSERT INTO posts (title, slug, content, tags, summary) VALUES (?, ?, ?, ?, ?);";
    con.query(sql, [title, slug, content, tags, summary], function(err, result) {
      if (err) {
        res.json({status: "NOK", error: err.message});
      }
      else {
        if (req.files) {
          var previewImage = req.files.previewImage;

          var currentdate = new Date();
          var fileNamePredecessor = currentdate.getDate().toString()+currentdate.getMonth().toString()+currentdate.getFullYear().toString()+currentdate.getTime().toString();
          var filename = fileNamePredecessor + previewImage.name;
          var title = path.basename(previewImage.name);
          previewImage.mv('./media/' + filename);

          var sql2 = "INSERT INTO preview_images (post_id, title, filename) VALUES (?, ?, ?);";
          con.query(sql2, [result.insertId, title, filename], function(err2, result2) {
            if (err2) {
              console.log(err2);
            }
          });
        }
        res.json({status: "OK", data: result});
      }
    });
  }
  else {
    res.json({status: "NOK", error: "You are not logged in."});
  }
});

app.post("/api/update-post", (req, res) => {
  if (req.session.isLoggedIn) {
    var postId = req.body.postId;
    var title = req.body.title;
    var content = req.body.content;
    var tags = req.body.tags;
    var summary = req.body.summary;

    var sql = "UPDATE posts SET title = ?, content = ?, tags = ?, summary = ? WHERE id = ?;";
    con.query(sql, [title, content, tags, summary, postId], function(err, result) {
      if (err) {
        res.json({status: "NOK", error: err.message});
      }
      else {
        if (req.files) {
          var previewImage = req.files.previewImage;

          var currentdate = new Date();
          var fileNamePredecessor = currentdate.getDate().toString()+currentdate.getMonth().toString()+currentdate.getFullYear().toString()+currentdate.getTime().toString();
          var filename = fileNamePredecessor + previewImage.name;
          var title = path.basename(previewImage.name);
          previewImage.mv('./media/' + filename);

          var sql2 = "DELETE FROM preview_images WHERE post_id = ?;";
          con.query(sql2, [postId], function(err2, result2) {
            var sql3 = "INSERT INTO preview_images (post_id, title, filename) VALUES (?, ?, ?);";
            con.query(sql3, [postId, title, filename], function(err3, result3) {
              if (err3) {
                console.log(err2);
              }
            });
          });
        }
        res.json({status: "OK", data: result});
      }
    });
  }
  else {
    res.json({status: "NOK", error: "You are not logged in."});
  }
});

app.get("/api/get-post-by-slug/:slug", (req, res) => {
  var slug = req.params.slug;

  var sql = "SELECT * FROM posts WHERE slug = ?;";
  con.query(sql, [slug], function(err, result) {
    if (err) {
      res.json({status: "NOK", error: err.message});
    }
    else {
      var sql2 = "SELECT * FROM preview_images WHERE post_id = ?;";
      con.query(sql2, [result[0].id], function(err2, result2) {
        var post;
        if (result2.length > 0) {
          post = {...result[0], previewImage: result2[0]};
        }
        else {
          post = {...result[0], previewImage: null};
        }
        res.json({status: "OK", data: post});
      });
    }
  });
});

app.post("/api/delete-post", (req, res) => {
  if (req.session.isLoggedIn) {
    var post_id = req.body.post_id;

    var sql = "DELETE FROM posts WHERE id = ?;";
    con.query(sql, [post_id], function(err, result) {
      if (err) {
        res.json({status: "NOK", error: err.message});
      }
      else {
        res.json({status: "OK", data: result});
      }
    });
  }
  else {
    res.json({status: "NOK", error: "You are not logged in."});
  }
});

app.get("/api/get-post-by-id/:post_id", (req, res) => {
  var post_id = req.params.post_id;

  var sql = "SELECT * FROM posts WHERE id = ?;";
  con.query(sql, [post_id], function(err, result) {
    if (err) {
      res.json({status: "NOK", error: err.message});
    }
    else {
      var sql2 = "SELECT * FROM preview_images WHERE post_id = ?;";
      con.query(sql2, [post_id], function(err2, result2) {
        var post;
        if (result2.length > 0) {
          post = {...result[0], previewImage: result2[0]};
        }
        else {
          post = {...result[0], previewImage: null};
        }
        console.log(post);
        res.json({status: "OK", data: post});
      });
    }
  });
});

app.get("/api/next-post", (req, res) => {
  var post_id = req.query.post_id;

  var sql = "SELECT slug FROM posts WHERE id > ? ORDER BY id ASC LIMIT 1;";
  con.query(sql, [post_id], function(err, result) {
    if (err) {
      res.json({status: "NOK", error: err.message});
    }
    if (result.length > 0) {
      res.json({status: "OK", data: "/blog-post/" + result[0].slug});
    }
    else {
      res.json({status: "NOK", error: "There is no next post."});
    }
  });
});

app.get("/api/previous-post", (req, res) => {
  var post_id = req.query.post_id;

  var sql = "SELECT slug FROM posts WHERE id < ? ORDER BY id DESC LIMIT 1;";
  con.query(sql, [post_id], function(err, result) {
    if (err) {
      res.json({status: "NOK", error: err.message});
    }
    if (result.length > 0) {
      res.json({status: "OK", data: "/blog-post/" + result[0].slug});
    }
    else {
      res.json({status: "NOK", error: "There is no previous post."});
    }
  });
});

app.post("/api/upload-image", (req, res) => {
  if (req.session.isLoggedIn) {
    if(!req.files) {
      res.json({status: "NOK", error: "Ficheiro em falta."});
      return;
    }
    var image = req.files.image;

    var currentdate = new Date();
    var fileNamePredecessor = currentdate.getDate().toString()+currentdate.getMonth().toString()+currentdate.getFullYear().toString()+currentdate.getTime().toString();
    var filename = fileNamePredecessor + image.name;
    var title = path.basename(iamge.name);
    image.mv('./media/' + filename);

    var sql = "INSERT INTO images (title, filename) VALUES (?, ?);";
    con.query(sql, [title, filename], function(err, result) {
      if (err) {
        res.json({status: "NOK", error: err.message});
      }
      else {
        res.json({status: "OK", data: {filename: filename, title: title}});
      }
    });
  }
  else {
    res.json({status: "NOK", error: "You are not logged in."});
  }
});

app.get("/api/get-file/:filename", (req, res) => {
  res.sendFile(path.resolve(__dirname) + '/media/' + req.params.filename);
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
  var author = escape(req.body.author);
  var content = escape(req.body.content);

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

app.get("/api/get-stats", (req, res) => {
  if (req.session.isLoggedIn) {
    var sql = "SELECT COUNT(*) AS total_views FROM analytics;";
    con.query(sql, function(err, result) {
      if (err) {
        res.json({status: "NOK", error: err.message});
      }
      else {
        var sql2 = "SELECT page_url, COUNT(*) AS views FROM analytics GROUP BY page_url;";
        con.query(sql2, function(err2, result2) {
          var stats = {total_views: result[0].total_views, page_views: result2};
          res.json({status: "OK", data: stats});
        });
      }
    });
  }
  else {
    res.json({status: "NOK", error: "You are not logged in."});
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
