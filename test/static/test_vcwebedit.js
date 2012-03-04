// Everything lives in the vcw namespace.
var vcw = vcw || {};


/** Run all the tests. */
vcw.run_tests = function()
{
  var results = document.getElementById('vcwebedit-test-results');
  results.style.display = 'block';

  module( "Utility functions." );

  test( 'vcw cookie functions', function()
    {
    vcw.create_cookie( "vcw_test_cookie", "monster" );
    var cookie = vcw.read_cookie( "vcw_test_cookie" );
    equal( cookie, "monster", "Cookie create/read test." );
    // Return to null.
    vcw.create_cookie( "vcw_test_cookie", "" );
    }
  );

  // Setup for a test.
  function setupCreateEditor()
    {
    this.editor = new vcw.Editor()
    ok( this.editor, "Editor created." );
    }


  module( "Editor.", { setup: setupCreateEditor } );
  test( "Editor.selectKeymap()", function()
    {
    var previousKeymap = vcw.read_cookie( "vcw.editor.keymap" );
    this.editor.selectKeymap( "emacs" );
    var codeMirror = this.editor.getCodeMirror(0);
    equal( codeMirror.getOption( "keyMap" ), "emacs", "Keymap selection changed CodeMirror option." );
    if( previousKeymap )
      {
      vcw.create_cookie( "vcw.editor.keymap", previousKeymap, 365 );
      }
    }
  );

  test( "Editor.selectTheme()", function()
    {
    var previousTheme = vcw.read_cookie( "vcw.editor.theme" );
    this.editor.selectTheme( "monokai" );
    var codeMirror = this.editor.getCodeMirror(0);
    equal( codeMirror.getOption( "theme" ), "monokai", "Theme selection changed CodeMirror option." );
    if( previousTheme )
      {
      vcw.create_cookie( "vcw.editor.theme", previousTheme, 365 );
      }
    }
  );
}; // end vcw.run_tests()
