var express = require('express');
var requestIp = require('request-ip');
var router = express.Router();
var pgp = require('pg-promise')();
var db = pgp(process.env.DATABASE_URL);
var util = require('../util.js');
pgp.pg.defaults.ssl = true;

router.get('/', function(req, res, next) {
  console.log('cookie: ');
  if (util.checkCookies(req.cookies) != true) {
    return res.redirect('/');
  }
  return res.render('geosaver', { title: 'GeoMessenger', name: req.cookies.name });
});

router.post('/saveMessage', function(req, res, next) {
  console.log(req.body.lat);
  console.log(req.body.lng);
  var lat = req.body.lat;
  var lng = req.body.lng;
  var message = req.body.message;
  var name = req.body.name;

  if (util.checkCookies(cookies) != true) {
    return res.status(407).json({err: "Invalid Session"});
  }

  db.query('INSERT INTO Markers ("lat", "lng", "name", "message") ' +
           'VALUES($1, $2, $3, $4);                               ',
    [lat, lng, name, message])
  .then(function() {
    return res.status(200).json({"success": "success"});
  })
  .catch(function() {
    return res.status(407).json({"err": "Could not save location"});
  })
});

router.get('/savedMarkers', function(req, res, next) {
  db.any('SELECT *      ' +
         'FROM Markers; ')
  .then(function (data) {
    if (data.length < 1) {
      return res.status(409).json({"err": "No Data"});
    }
    var count = 0;
    var JSON_Markers = [];
    while(count < data.length) {
      JSON_Markers.push({lat: data[count].lat, lng: data[count].lng,
        name: data[count].name, message:data[count].message});
      //console.log("count: " + count);
      //console.log("data length: " + data.length);
      count++;
      //console.log(count);
      if (count == data.length) {
        return res.status(200).json(JSON_Markers);
      }
    }
  })
  .catch(function (err) {
    console.log(err);
    return res.status(409).json({"err": "error"});
  });
});


module.exports = router;