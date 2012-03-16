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

  test( "Editor.generatePatch()", function()
    {
    var codeMirror = this.editor.getCodeMirror(0);
    var filename = "filename_diff.cxx";
    var input1 = 'Welcome to the National Library of Medicine Insight Segmentation and Registration Toolkit (ITK).\n' +
              'ITK is an open-source, cross-platform system that provides developers with an extensive suite of software tools for image analysis.\n' +
              'Developed through extreme programming methodologies, ITK employs leading-edge algorithms for registering and segmenting multidimensional data.\n' +
              'The goals for ITK include:\n' +
              ' * Supporting the Visible Human Project.\n' +
              ' * Establishing a foundation for future research.\n' +
              ' * Creating a repository of fundamental algorithms.\n' +
              ' * Developing a platform for advanced product development.\n' +
              ' * Support commercial application of the technology.\n' +
              ' * Create conventions for future work.\n' +
              ' * Grow a self-sustaining community of software users and developers.';
    var input2 = 'Welcome to the National Library of Medicine Insight Segmentation and Registration Toolkit (ITK).\n'  +
              'ITK is an open-source, cross-platform system that provides developers with an extensive suite of software tools for image analysis.\n' +
              'Developed through extreme programming methodologies, ITK employs leading-edge algorithms for processing, registering and segmenting multidimensional data.\n' +
              'The goals for ITK include:';
    var buffer = new editor.Buffer(filename, input1, filename, input2 );
    this.editor.buffers.push( buffer );

    var patch = this.editor.generatePatch();
    var expected = 'Index: filename_diff.cxx\n' +
      '===================================================================\n' +
      '--- filename_diff.cxx\ta/filename_diff.cxx\n' +
      '+++ filename_diff.cxx\tb/filename_diff.cxx\n' +
      '@@ -1,11 +1,4 @@\n' +
      ' Welcome to the National Library of Medicine Insight Segmentation and Registration Toolkit (ITK).\n' +
      ' ITK is an open-source, cross-platform system that provides developers with an extensive suite of software tools for image analysis.\n' +
      '+Developed through extreme programming methodologies, ITK employs leading-edge algorithms for processing, registering and segmenting multidimensional data.\n' +
      '+The goals for ITK include:\n' +
      '\\ No newline at end of file\n' +
      '-Developed through extreme programming methodologies, ITK employs leading-edge algorithms for registering and segmenting multidimensional data.\n' +
      '-The goals for ITK include:\n' +
      '- * Supporting the Visible Human Project.\n' +
      '- * Establishing a foundation for future research.\n' +
      '- * Creating a repository of fundamental algorithms.\n' +
      '- * Developing a platform for advanced product development.\n' +
      '- * Support commercial application of the technology.\n' +
      '- * Create conventions for future work.\n' +
      '- * Grow a self-sustaining community of software users and developers.\n' +
      '\\ No newline at end of file\n';
    equal( patch, expected, "The generated patch did what was expected." );
    }
  );
}; // end vcw.run_tests()
