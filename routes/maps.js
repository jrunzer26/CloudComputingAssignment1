var express = require('express');
var requestIp = require('request-ip');
var router = express.Router();
var pgp = require('pg-promise')();
var db = pgp(process.env.DATABASE_URL);

router.get('/', function(req, res, next) {
  return res.render('geosaver', { title: 'Geosaver' });
});

router.post('saveLocation', function(req, res, next) {
  
});

router.get('/savedMarkers', function(req, res, next) {
  db.any('SELECT *      ' +
         'FROM Markers; ')
  .then(function (data) {
    if (data.length < 1) {
      return res.status(409).json({"err": "No Data"});
    }
    var count = 0;
    var JSON_Markers = {markers: {}};
    while(count < data.length) {
      JSON_Markers.markers.push({lat: data[count].lat, lng: data[count].lng});
      count++;
      if (count == data.length - 1) {
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