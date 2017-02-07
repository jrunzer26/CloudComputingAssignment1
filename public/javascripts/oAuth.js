/** 
 * Author: Jason Runzer
 * oAuth.js
 * 2/7/2017
 * Client side javascript for google authentication.
 */

/**
 * Signs in the google user.
 */
function onSignIn(googleUser) {
  // check if the user is already signed in, and redirect to the map page.
  if (!(sessionStorage.getItem('logout') == 'true')) {
    var profile = googleUser.getBasicProfile();
    var id_token = googleUser.getAuthResponse().id_token;
    authenticateWithBackend(profile);
  } else {
    authLogout();
  }
}

/**
 * Authenticates the google profile with the backend.
 */
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

/**
 * Logs the user out of the google authentication.
 */
function authLogout() {
  // remove the session information
  sessionStorage.removeItem('logout');
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}

/**
 * Sets the logut session information to true, for redirection to the login page
 * to prevent auto login.
 */
function signOut() {
  console.log("signing out");
  sessionStorage.setItem('logout', 'true');
  redirectLogout();
}

/**
 * Redirects the user to the logout page.
 */
function redirectLogout() {
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

/**
 * Redirectes the user to the main map page.
 */
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