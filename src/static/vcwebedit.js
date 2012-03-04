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

/** Editor object.  Manages multiple CodeMirror editors. */
vcw.Editor = function()
{
  // Clear the default, which is the path to the document.
  $('#editor').html("");

  // Start with one empty editor.
  this.codeMirrorEditors = [CodeMirror( document.getElementById("editor"), {
      mode:  "rst",
      lineWrapping: true,
      lineNumbers: true
      })];

}

/** Get one of the internal CodeMirror editor instances.
 *
 * \param idx The index of the CodeMirror instance.  Defaults to 0.
 *
 * Method on the Editor object.
 */
vcw.Editor.prototype.getCodeMirror = function( idx )
{
  if( !idx )
    {
    idx = 0;
    }
  return this.codeMirrorEditors[idx];
}

/** Load a file into the editor.
 *
 * Method on the Editor object.
 */
vcw.Editor.prototype.loadFile = function( url, editorIdx )
{
  if( editorIdx == null )
    {
    editorIdx = 0;
    }

  var editor = this.codeMirrorEditors[editorIdx];
  var data = $.get(url, function(data)
    {
    editor.setValue( data );
    });
}

/** Select a different keymap.
 *
 * Uses the keymap argument or the values of the element with id vcw.keymapSelection
 *
 * Method on the Editor object.
 */
vcw.Editor.prototype.selectKeymap = function( keymap )
{
  if( !keymap )
    {
    keymap = document.getElementById( "vcw.keymapSelection" ).value;
    }

  var ii;
  for( ii = 0; ii < this.codeMirrorEditors.length; ++ii )
    {
    this.codeMirrorEditors[ii].setOption( "keyMap", keymap );
    }
  vcw.create_cookie( "vcw.editor.keymap", keymap, 365 );
}

/** Select a different theme.
 *
 * Uses the theme argument or the values of the element with id vcw.themeSelection
 *
 * Method on the Editor object.
 */
vcw.Editor.prototype.selectTheme = function( theme )
{
  if( !theme )
    {
    theme = document.getElementById( "vcw.themeSelection" ).value;
    }

  var ii;
  for( ii = 0; ii < this.codeMirrorEditors.length; ++ii )
    {
    this.codeMirrorEditors[ii].setOption( "theme", theme );
    }
  vcw.create_cookie( "vcw.editor.theme", theme, 365 );
}
