module.exports.checkCookies = function(cookies) {
  console.log('test check');
  if (typeof cookies.email == 'undefined')
    return "missing email";
  else if (typeof cookies.img == 'undefined')
    return "missing profile img";
  else if(typeof cookies.name == 'undefined')
    return "missing name";
  else 
    return true;
}