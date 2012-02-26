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
    var keymap = readCookie( "vcw_keymap" );
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
  createCookie( "vcw_keymap", keymap, 365 );
}
