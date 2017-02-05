var express = require('express');
var app = express();
var router = express.Router();
var pgp = require('pg-promise')();
var db = pgp(process.env.DATABASE_URL);
var util = require('../util.js');
var badWords = require('bad-words');
var filter = new badWords();

pgp.pg.defaults.ssl = true;

router.get('/', function(req, res, next) {
  if (util.checkCookies(req.cookies) != true) {
    return res.redirect('/');
  }
  return res.render('geosaver', { title: 'GeoMessenger', name: req.cookies.name });
});

router.post('/saveMessage', function(req, res, next) {
  
  
  var lat = req.body.lat;
  var lng = req.body.lng;
  var message = filter.clean(req.body.message);
  var name = req.body.name;
  db.query('INSERT INTO Markers ("lat", "lng", "name", "message") ' +
           'VALUES($1, $2, $3, $4);                               ',
    [lat, lng, name, message])
  .then(function() {
    res.io.sockets.emit("messageFeed", {lat: lat, lng: lng, 
      message: message, name: name});
      
      //res.io.sockets.broadcast.emit('user connected');
    return res.status(200).json({"success": "success"});
  })
  .catch(function() {
    return res.status(407).json({"err": "Could not save location"});
  });
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
      count++;
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