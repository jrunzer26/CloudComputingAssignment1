var express = require('express');
var requestIp = require('request-ip');
var router = express.Router();
var GOOGLE_MAPS_KEY = "AIzaSyATPxs1A1SXw_eJUn5FxnTNjpIEc193nNM";

/* GET home page. */
router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/saveIP', function(req, res, next) {
  var ip = requestIp.getClientIp(req);
  return res.status(200).send({ipAddress: ip});  
});


/* Login page. */

router.get('/', function(req, res, next) {
  return res.render('login', {title: 'GeoSaver Login'});
});

module.exports = router;
