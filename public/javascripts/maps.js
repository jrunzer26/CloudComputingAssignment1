var map;
var locationMarker;
var infoWindow;
var currentMessageId = 0;
var currentLocation;

var socket = io();
socket.on('messageFeed', function (data) {
  addMarker(data, true);
  console.log('received');
  insertMessageIntoToFeed(data);
});



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
    currentLocation = pos;
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
				for (var i = 0; i < res.length; i++) {
          // Add markers to the map
          addMarker(res[i], false);
          
				}
			},
			error: function(res) {
				console.log(res);
				message(res.responseJSON.err, "Error. Could not get markers.");
			}
	});
}

function addMarker(markerInfo, openWindow) {
  var markerPosition = {lat: parseFloat(markerInfo.lat), lng: parseFloat(markerInfo.lng)};
  console.log(markerInfo);
  var marker = new google.maps.Marker({
    position: markerPosition,
    map: map,
  });
  var text = '<h5>'+markerInfo.name+'</h5>'+
    '<p>'+markerInfo.message+'</p>';
  var infoWindowTemp = new google.maps.InfoWindow({
    content: text
  });
  
  marker.addListener('click', function() {
    infoWindowTemp.open(map, marker);
  });
  if(openWindow) {
    if (markerMessageInCurrentLocaiton(markerInfo)) {
      infoWindow.close();
      locationMarker.setMap(null);
      locationMarker = marker;
      infoWindow = infoWindowTemp;
    }
    infoWindowTemp.open(map, marker);
    
  }
  insertMessageIntoToFeed(markerInfo, infoWindowTemp, marker);
}

function markerMessageInCurrentLocaiton(markerInfo) {
  if (markerInfo.lat == currentLocation.lat && markerInfo.lng == currentLocation.lng) {
    return true;
  } else {
    return false;
  }
}


function sendMessage() {
  var text = $('#messageField').val();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
    var messageObject = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      name: $.cookie('name'),
      message: text
    };
    saveMessage(messageObject);
    }, function() {
      console.log("Error saving location");
    });
  } else {
    // Browser doesn't support Geolocation
    console.log("Error saving location");
  }
}

function saveMessage(messageObject) {
  console.log('save message');
  $.ajax({
    type: 'POST',
    url: '/map/saveMessage',
    data: JSON.stringify(messageObject),
    contentType: "application/json; charset=utf-8",
    success: function(res) {
      console.log("success");
    },
    error: function(res) {
      console.log(res);
    }
  });
};



function insertMessageIntoToFeed(message, aInfoWindow, marker) {
  var messageHTML = '<div class="message" id="'+ currentMessageId + '"><h5>'+message.name+'</h5>'+
    '<p>'+message.message+'</p><hr></div>';
  $("#messageFeed").prepend(messageHTML);
  $("#" + currentMessageId).click(function() {
    aInfoWindow.open(map, marker)
  });
  currentMessageId++;
};