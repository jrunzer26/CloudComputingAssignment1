/** 
 * Author: Jason Runzer
 * index.js
 * 2/7/2017
 * This file handles all the routes from the base url. It also handles the google authentication
 * login and logout.
 */

var express = require('express');
var router = express.Router();
var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var cookieParser = require('cookie-parser');

/* Login page. */
router.get('/', function(req, res, next) {
  return res.render('login', {title: 'GeoMessenger Login'});
});

/** 
 * Google Authentication Login and storage of credentials in a cookie.
 * req.body: {img: profile_img_url, name: 'Jason Runzer', email: 'jason.runzer@uoit.net'}
 */
router.post('/googleAuth', function(req, res, next) {
  // set the cookie with their google info
  res.cookie('img', req.body.img);
  res.cookie('name', req.body.name);
  res.cookie('email', req.body.email);
  res.status(200).json({success:"ok"});
});

/**
 * Logout and remove session cookies, redirect to the login page.
 */
router.get('/logout', function(req, res, next) {
  res.clearCookie();
  res.redirect('/');
});

module.exports = router;
