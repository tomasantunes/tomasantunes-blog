var express = require('express');
var router = express.Router();
var { getMySQLConnection } = require('../libs/database');
var path = require('path');


var con = getMySQLConnection();

// This route allows the client to upload an image to the media folder and inserts the corresponding title and filename to the images table.
router.post("/api/upload-image", (req, res) => {
  if (req.session.isLoggedIn) {
    if(!req.files) {
      res.json({status: "NOK", error: "Ficheiro em falta."});
      return;
    }
    var image = req.files.image;

    var currentdate = new Date();
    var fileNamePredecessor = currentdate.getDate().toString()+currentdate.getMonth().toString()+currentdate.getFullYear().toString()+currentdate.getTime().toString();
    var filename = fileNamePredecessor + image.name;
    var title = path.basename(image.name);
    image.mv(path.join(__dirname, '../media/' + filename), function(err) {
      if (err) {
        res.json({status: "NOK", error: err.message});
        return;
      }
    });

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

module.exports = router;
