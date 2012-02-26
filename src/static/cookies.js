function createCookie(cookie_name, value, expiration_days, path)
{
  var expires = '';
  if( expiration_days )
    {
    var expiration_date = new Date();
    expiration_date.setDate( expiration_date.getDate() + expiration_days );
    expires = '; expires=' + expiration_date.toUTCString();
    }
  var path_entry = '; path=/';
  if( path )
    {
    path_entry = '; path=' + escape( path )
    }
  document.cookie = cookie_name + '=' + escape( value ) + expires + path_entry
}

function readCookie(desired_cookie_name)
{
  var cookies = document.cookie.split(';');
  for( var ii = 0; ii < cookies.length; ++ii )
    {
    var cookie_name  = cookies[ii].substr(0, cookies[ii].indexOf('='));
    var cookie_value = cookies[ii].substr(cookies[ii].indexOf('=') + 1);
    cookie_name.replace(/^\s+|\s+$/g, "");
    if( cookie_name == desired_cookie_name )
      {
      return unescape( cookie_value );
      }
    }
  return null;
}

