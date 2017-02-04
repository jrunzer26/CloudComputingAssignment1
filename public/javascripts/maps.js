var map;
var locationMarker;
var infoWindow;

function initMap() {
  var uluru = {lat: -25.363, lng: 131.044};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: uluru
  });
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    locationMarker = new google.maps.Marker({
      position: pos,
      map: map
    })
    
    map.setCenter(pos);
      var text = '<h5>Your Location</h3>';
    infoWindow = new google.maps.InfoWindow({
      content: text
    });

    locationMarker.addListener('click', function() {
      infoWindow.open(map, locationMarker);
    });

    addAllSavedMarkers();
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
}


function addAllSavedMarkers() {
  $.ajax({
			type: 'GET',
			url: '/map/savedMarkers',
			contentType: "application/json; charset=utf-8",
			success: function(res) {
        console.log(res[0]);
				for (var i = 0; i < res.length; i++) {
          // Add markers to the map
          console.log(res[i]);
          console.log(res[i].lat);
          console.log(res[i].lng);
          console.log(res[i].name);
          console.log(res[i].message);
          addMarker(res[i], map);
				}
			},
			error: function(res) {
				console.log(res);
				message(res.responseJSON.err, "Error. Could not get markers.");
			}
	});
}

function addMarker(markerInfo) {
  var markerPosition = {lat: parseFloat(markerInfo.lat), lng: parseFloat(markerInfo.lng)};
  console.log(markerPosition);
  var marker = new google.maps.Marker({
    position: markerPosition,
    map: map,
  });
  var text = '<h5>'+markerInfo.name+'</h5>'+
    '<p>'+markerInfo.message+'</p>';
  var infoWindow = new google.maps.InfoWindow({
    content: text
  });
  marker.addListener('click', function() {
    infoWindow.open(map, marker);
  });
}

$(document).ready(function() {
	$('#saveLocation').click(function() {
		if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      saveLocation(pos);
      }, function() {
        console.log("Error saving location");
      });
    } else {
      // Browser doesn't support Geolocation
      console.log("Error saving location");
    }
	});
});

function saveLocation(pos) {
// GET the saved markers
  $.ajax({
    type: 'POST',
    url: '/map/saveLocation',
    data: JSON.stringify(pos),
    contentType: "application/json; charset=utf-8",
    success: function(res) {
      console.log("success");
    },
    error: function(res) {
      console.log(res);
    }
  });
};
