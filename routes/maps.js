var express = require('express');
var requestIp = require('request-ip');
var router = express.Router();

router.get('/', function(req, res, next) {
  return res.render('geosaver', { title: 'Geosaver' });
});

module.exports = router;