/** 
 * Author: Jason Runzer
 * util.js
 * 2/7/2017
 * This file is a utility class to check the cookies of the user's session.
 *  
 */

/**
 * Checks the request cookies to see if the user has the required information stored.
 */
module.exports.checkCookies = function(cookies) {
  if (typeof cookies.email == 'undefined')
    return "missing email";
  else if (typeof cookies.img == 'undefined')
    return "missing profile img";
  else if(typeof cookies.name == 'undefined')
    return "missing name";
  else 
    return true;
}