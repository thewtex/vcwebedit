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

  module( "Editor.", {
    setup: function ()
      {
      this.editor = new vcw.Editor()
      ok( this.editor, "Editor created." );
      }
    }
  );

  test( "Editor.selectKeymap()", function()
    {
    var previousKeymap = vcw.read_cookie( "vcw.editor.keymap" );
    this.editor.selectKeymap( "emacs" );
    var codeMirror = this.editor.getCodeMirror(0);
    equal( codeMirror.getOption( "keyMap" ), "emacs", "Keymap selection changed CodeMirror option." );
    vcw.create_cookie( "vcw.editor.keymap", previousKeymap, 365 );
    }
  );
}; // end vcw.run_tests()
