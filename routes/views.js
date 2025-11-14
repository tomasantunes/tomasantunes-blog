var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/blog-post/:slug', (req,res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

router.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

router.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

router.get('/search-results/:query', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

router.get('/admin', (req, res) => {
  if(req.session.isLoggedIn) {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  }
  else {
    res.redirect('/login');
  }
});

router.get('/admin/posts', (req, res) => {
  if(req.session.isLoggedIn) {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  }
  else {
    res.redirect('/login');
  }
});

router.get('/admin/new-post', (req, res) => {
  if(req.session.isLoggedIn) {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  }
  else {
    res.redirect('/login');
  }
});

router.get('/admin/edit-post/:post_id', (req, res) => {
  if(req.session.isLoggedIn) {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  }
  else {
    res.redirect('/login');
  }
});

module.exports = router;