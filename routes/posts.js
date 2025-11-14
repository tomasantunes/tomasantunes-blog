var express = require('express');
var path = require("path");
var router = express.Router();
var { getMySQLConnection } = require('../libs/database');

var con = getMySQLConnection();

router.get("/api/get-posts", (req, res) => {
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

router.get("/api/get-all-posts", (req, res) => {
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

router.post("/api/add-post", (req, res) => {
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

router.post("/api/update-post", (req, res) => {
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

router.get("/api/get-post-by-slug/:slug", (req, res) => {
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

router.post("/api/delete-post", (req, res) => {
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

router.get("/api/get-post-by-id/:post_id", (req, res) => {
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

router.get("/api/next-post", (req, res) => {
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

router.get("/api/previous-post", (req, res) => {
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

module.exports = router;
