var express = require('express');
var router = express.Router();
var path = require('path');

// This route retrieves the main homepage of the blog.
router.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

module.exports = router;
