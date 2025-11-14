var express = require('express');
var router = express.Router();
var path = require('path');

// This route returns a file to the browser from the media folder based ont he filename.
router.get("/api/get-file/:filename", (req, res) => {
  res.sendFile(path.join(__dirname, '../media', req.params.filename));
});

module.exports = router;
