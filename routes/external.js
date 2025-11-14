var express = require('express');
var router = express.Router();
var { getMySQLConnection } = require('../libs/database');
var secretConfig = require('../secret-config.json');

var con = getMySQLConnection();

// This route allows an external application to insert a post on the blog if they have the API key.
router.post("/external/add-post", (req, res) => {
    if (req.body.api_key != secretConfig.EXTERNAL_API_KEY) {
        return res.status(401).json({status: "NOK", error: "Invalid Authorization"});
    }

    var title = req.body.title;
    var content = req.body.content;
    var tags = req.body.tags;
    var summary = req.body.summary;
    var slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    var sql = "INSERT INTO posts (title, slug, content, tags, summary) VALUES (?, ?, ?, ?, ?);";
    con.query(sql, [title, slug, content, tags, summary], function(err, result) {
      if (err) {
        res.json({status: "NOK", error: err.message});
        return;
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
              res.json({status: "NOK", error: err2.message});
            }
          });
        }
      }
      res.json({status: "OK", data: result});
    });
});

module.exports = router;
