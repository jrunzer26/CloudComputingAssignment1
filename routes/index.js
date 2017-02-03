var express = require('express');
var requestIp = require('request-ip');
var router = express.Router();
var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var CLIENT_ID = '957314887645-6p2samrj66sicgk3ruopl4b3bis3ksv1';
var client = new auth.OAuth2(CLIENT_ID, '', '');
var cookieParser = require('cookie-parser');

/* Login page. */
router.get('/', function(req, res, next) {
  return res.render('login', {title: 'GeoMessenger Login'});
});

router.post('/googleAuth', function(req, res, next) {
  // set the cookie with their google info
  res.cookie('img', req.body.img);
  res.cookie('name', req.body.name);
  res.cookie('email', req.body.email);
  res.status(200).json({success:"ok"});
});

router.get('/logout', function(req, res, next) {
  res.clearCookie();
  console.log('logout');
  res.redirect('/');
});

module.exports = router;
