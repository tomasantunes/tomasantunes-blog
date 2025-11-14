var express = require('express');
var router = express.Router();
var { getMySQLConnection } = require('../libs/database');
var secretConfig = require('../secret-config');
var TurndownService = require('turndown');
var axios = require('axios');

var con = getMySQLConnection();
const turndownService = new TurndownService();

router.post("/api/export-to-wiki", (req, res) => {
  if (req.session.isLoggedIn) {
    var sql = "SELECT * FROM posts;";
    con.query(sql, async function(err, result) {
      if (err) {
        res.json({status: "NOK", error: err.message});
      }
      else {
        for (var i = 0; i < result.length; i++) {
          var post = result[i];
          var title = post.title;
          var markdownContent = turndownService.turndown(post.content);
          var tags = "";
          if (post.tags) tags = post.tags.split(',').map(tag => tag.trim()).join(',');
          
          try {
            const response = await axios.post(secretConfig.WIKI_URL + "/external/files/upsert", {
              api_key: secretConfig.WIKI_API_KEY,
              title: title,
              content: markdownContent,
              extension: "md",
              category: secretConfig.WIKI_CATEGORY,
              tags: tags
            });
            if (response.data.status == "NOK") {
              return res.json({status: "NOK", error: response.data.error});
            }
          } catch(error) {
            return res.json({status: "NOK", error: error.message});
          }
        }
        res.json({status: "OK", data: result});
      }
    });
  }
  else {
    res.json({status: "NOK", error: "You are not logged in."});
  }
});

module.exports = router;