var express = require('express');
var requestIp = require('request-ip');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/saveIP', function(req, res, next) {
  console.log('before ip');
  var savedIP = 1;
  /*
  publicIp.v4().then(function(ip) {
    console.log('test');
    console.log(ip);
    var addressInformation = {
      ipAddress: ip
    };
    return res.status(200).send(addressInformation);
  })
  .catch(function(err) {
    return res.status(400).send({ipError: err});
  });
  */
  var ip = requestIp.getClientIp(req);
  return res.status(200).send({ipAddress: ip});  
});

module.exports = router;
