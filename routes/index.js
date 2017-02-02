var express = require('express');
var requestIp = require('request-ip');
var router = express.Router();
var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var CLIENT_ID = '957314887645-6p2samrj66sicgk3ruopl4b3bis3ksv1.apps.googleusercontent.com';
var client = new auth.OAuth2(CLIENT_ID, '', '');

/* Login page. */
router.get('/', function(req, res, next) {
  return res.render('login', {title: 'GeoMesseger Login'});
});

router.post('/googleAuth', function(req, res, next) {
  //console.log(req.body.token);
  client.verifyIdToken(
    token,
    CLIENT_ID,
    function(e, login) {
      var payload = login.getPayload();
      var userid = payload['sub'];
      console.log(userid);
      return res.status(200).json({success: "success"});
    });
});

module.exports = router;
