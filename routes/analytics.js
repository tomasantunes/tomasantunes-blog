var express = require('express');
var router = express.Router();
var { getMySQLConnection } = require('../libs/database');
const { lookup } = require('geoip-lite');

var con = getMySQLConnection();

// This route receives a full URL,a referrer and the IP when a user enters a page. It gets the current date and the location based on the IP. It gets the OS and browser from the User Agent and insert an entry into the analytics table.
router.get("/api/analytics/page-entry", (req, res) => {
  var fullUrl = req.query.fullUrl;
  var referrer = req.query.referrer;
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

  var sql = "INSERT INTO analytics (page_url, entry_time, ip_address, country, operating_system, browser, browser_version, referrer) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";
  con.query(sql, [fullUrl, dt, ip, location, operating_system, browser, browser_version, referrer], function (err, result) {
    if (err) {
      console.log(err);
    }
  });
});

// This route receives a full URL and the IP when the user exits a page and insert it into the analytics table.
router.get("/api/analytics/exit-page", (req, res) => {
  var fullUrl = req.query.fullUrl;
  var dt = new Date().toISOString().slice(0, 19).replace('T', ' ');
  var dt_today = new Date().toISOString().slice(0, 10);
  var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (ip.substr(0, 7) == "::ffff:") {
    ip = ip.substr(7)
  }

  var sql = "UPDATE analytics SET exit_time = ? WHERE page_url = ? AND ip_address = ? AND entry_time LIKE ?;";
  con.query(sql, [dt, fullUrl, ip, '%' + dt_today + '%'], function (err, result) {
    if (err) {
      console.log(err);
    }
    res.json({status: "OK"});
  });
});

// This route returns the analytics table.
router.get("/api/get-stats", (req, res) => {
  if (req.session.isLoggedIn) {
    var sql = "SELECT COUNT(*) AS total_views FROM analytics;";
    con.query(sql, function(err, result) {
      if (err) {
        res.json({status: "NOK", error: err.message});
      }
      else {
        var sql2 = "SELECT page_url, COUNT(*) AS views FROM analytics GROUP BY page_url;";
        con.query(sql2, function(err2, result2) {
          var sql3 = "SELECT ip_address, country, operating_system, browser, browser_version FROM analytics GROUP BY ip_address, country, operating_system, browser, browser_version";
          con.query(sql3, function(err3, result3) {
            var sql4 = "SELECT DISTINCT referrer FROM analytics";
            con.query(sql4, function(err4, result4) {
              var stats = {total_views: result[0].total_views, page_views: result2, users: result3, referrers: result4};
              res.json({status: "OK", data: stats});
            });
          });
        });
      }
    });
  }
  else {
    res.json({status: "NOK", error: "You are not logged in."});
  }
});

module.exports = router;
