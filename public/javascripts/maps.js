/** 
 * Author: Jason Runzer
 * maps.js
 * 2/7/2017
 * Client side javascript for map manipulation, and server side interaction.
 */

var map;
var locationMarker;
var infoWindow;
var currentMessageId = 0;
var currentLocation;
var messageFeedCount = 0;
var lastRemovedMessageID = 0;
var MESSAGE_FEED_LIMIT = 9;

// load the socket connection
var socket = io();
socket.on('messageFeed', function (data) {
  addMarker(data, true);
});

// initalize the google map 
function initMap() {
  // set a default starting location
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
    // put a location marker of the current postion on the map
    locationMarker = new google.maps.Marker({
      position: pos,
      map: map
    })
    map.setCenter(pos);
    // create an info window on your location
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
/**
 * Handles the location error if the browser does not support location.
 */
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
}

/**
 * Retreives and adds all saved markers from the server.
 */
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

/**
 * Adds a marker to the map.
 * markerInfo = {lat: 20.000, lng:21.000, name: 'jason runzer', message: 'hello'}
 */
function addMarker(markerInfo, openWindow) {
  var markerPosition = {lat: parseFloat(markerInfo.lat), lng: parseFloat(markerInfo.lng)};
  var marker = new google.maps.Marker({
    position: markerPosition,
    map: map,
  });
  // create the text for the marker. 
  var text = '<h5>'+markerInfo.name+'</h5>'+
    '<p>'+markerInfo.message+'</p>';
  var infoWindowTemp = new google.maps.InfoWindow({
    content: text
  });
  marker.addListener('click', function() {
    infoWindowTemp.open(map, marker);
  });
  // open the window if it is an incoming message
  if(openWindow) {
    // try to close the info window in the current location if it is our message.
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

/**
 * Check if the message is in the same location as the user, true if it is.
 */
function markerMessageInCurrentLocaiton(markerInfo) {
  if (markerInfo.lat == currentLocation.lat && markerInfo.lng == currentLocation.lng) {
    return true;
  } else {
    return false;
  }
}

/**
 * Insert the message into the message feed.
 * message = {name: 'jason runzer', message: 'hello'}
 */
function insertMessageIntoToFeed(message, aInfoWindow, marker) {
  var messageHTML = '<div class="message" id="'+ currentMessageId + '"><h5>'+message.name+'</h5>'+
    '<p>'+message.message+'</p><hr></div>';
  $("#messageFeed").prepend(messageHTML);
  // add a click listener to the div  to open the message on the map.
  $("#" + currentMessageId).click(function() {
    aInfoWindow.open(map, marker)
  });
  messageFeedCount++;
  // ensure that the feed only has as many as the limit
  while(lastRemovedMessageID < messageFeedCount - MESSAGE_FEED_LIMIT) {
    $("#" + lastRemovedMessageID).remove();
    lastRemovedMessageID++;
  }
  currentMessageId++;
};

/**
 * Takes the message contents from the text fields and sends it to the server.
 */
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

/**
 * Sends the message to the server.
 * messageObject = {lat: 20.000, lng:21.000, name: 'jason runzer', message: 'hello'}
 */
function saveMessage(messageObject) {
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


