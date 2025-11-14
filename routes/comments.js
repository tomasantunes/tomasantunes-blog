var express = require('express');
var router = express.Router();
var { getMySQLConnection } = require('../libs/database');
var {getChildrenComments, sendCommentEmail} = require('../libs/comments');
var escape = require('escape-html');

var con = getMySQLConnection();

router.get("/api/get-comments/:post_id", (req, res) => {
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

router.post("/api/add-comment", (req, res) => {
  var post_id = req.body.post_id;
  var parent_id = req.body.parent_id;
  var author = escape(req.body.author);
  var content = escape(req.body.content);

  sendCommentEmail(author, content);

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

module.exports = router;