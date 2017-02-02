

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  var id_token = googleUser.getAuthResponse().id_token;
  console.log("Token: " + id_token);
  authenticateWithBackend(id_token);
  $( "#signOutBtn" ).show();
}

function authenticateWithBackend(id_token) {
  $.ajax({
    type: 'POST',
    url: '/googleAuth',
    data: JSON.stringify({token: id_token}),
    contentType: "application/json; charset=utf-8",
    success: function(res) {
      console.log("Succesful login!!");
    },
    error: function(res) {
      console.log(res);
    }
  });
}
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
    $( "#signOutBtn" ).hide();
  });
}

$(document).ready(function() {
  $( "#signOutBtn" ).hide();
});
