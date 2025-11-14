var express = require('express');
var router = express.Router();
var { getMySQLConnection } = require('../libs/database');

var con = getMySQLConnection();

// This route lets you search for posts based on the title, content or tags.
router.get("/api/search/:query", (req, res) => {
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

module.exports = router;
