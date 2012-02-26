// Everything lives in the vcw namespace.
var vcw = vcw || {};


/** Create a browser cookie.  If path is not set, then it defaults to '/'.
 */
vcw.create_cookie = function ( cookie_name, value, expiration_days, path )
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

vcw.read_cookie = function ( desired_cookie_name )
{
  var cookies = document.cookie.split(';');
  var cookie_name;
  var cookie_value;
  var ii;

  for( ii = 0; ii < cookies.length; ++ii )
    {
    cookie_name  = cookies[ii].substr(0, cookies[ii].indexOf('='));
    cookie_value = cookies[ii].substr(cookies[ii].indexOf('=') + 1);
    cookie_name = cookie_name.replace(/^\s+|\s+$/g, "");
    if( cookie_name == desired_cookie_name )
      {
      return unescape( cookie_value );
      }
    }
  return null;
}

// Load the file into the editor interface.
function vcw_editFile(url)
{
  $.get(url, function(data) {
    // Clear the default, which is the path to the document.
    $('#editor').html("");
    vcw_editor = CodeMirror( document.getElementById("editor"), {
      value: data,
      mode:  "rst",
      lineNumbers: true
      });
    var keymap = vcw.read_cookie( "vcw_keymap" );
    if( keymap )
      {
      vcw_editor.setOption( "keyMap", keymap );
      document.getElementById( "keymapSelection" ).value = keymap;
      }
    });
}

function vcw_selectKeymap()
{
  var keymap = document.getElementById( "keymapSelection" ).value;
  vcw_editor.setOption( "keyMap", keymap );
  vcw.create_cookie( "vcw_keymap", keymap, 365 );
}
