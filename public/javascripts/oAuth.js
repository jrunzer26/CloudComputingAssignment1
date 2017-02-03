
function onSignIn(googleUser) {
  if (!(sessionStorage.getItem('logout') == 'true')) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("Token: " + id_token);
    authenticateWithBackend(profile);
  } else {
    authLogout();
    
  }
}

function authLogout() {
  sessionStorage.removeItem('logout');
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
  console.log('User signed out.');
  });
}

function authenticateWithBackend(profile) {
  $.ajax({
    type: 'POST',
    url: '/googleAuth',
    data: JSON.stringify({
      email: profile.getEmail(),
      name: profile.getName(),
      img: profile.getImageUrl()
    }),
    contentType: "application/json; charset=utf-8",
    success: function(res) {
      console.log("Succesful login!!");
      window.location = '/map';
      redirectToMap(profile);
    },
    error: function(res) {
      console.log(res);
    }
  });
}


function signOut() {
  console.log("signing out");
  sessionStorage.setItem('logout', 'true');
  redirectLogout();
}

function redirectLogout() {
  console.log('redirect logout');
  $.ajax({
    type: 'GET',
    url: '/logout',
    success: function(res) {
      console.log("Succesful logout");
      window.location = '/logout';
    },
    error: function(res) {
      console.log(res);
    }
  });
}


function redirectToMap(profile) {
  $.ajax({
    type: 'POST',
    url: '/map',
    data: JSON.stringify({
      email: profile.getEmail(),
      name: profile.getName(),
      img: profile.getImageUrl()
    }),
    contentType: "application/json; charset=utf-8",
    success: function(res) {
      console.log("Succesful login!!");
    },
    error: function(res) {
      console.log(res);
    }
  });
}