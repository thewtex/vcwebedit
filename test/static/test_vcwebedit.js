// Everything lives in the vcw namespace.
var vcw = vcw || {};


/** Run all the tests. */
vcw.run_tests = function()
{
  var results = document.getElementById('vcwebedit-test-results');
  results.style.display = 'block';

  module( "Utility functions." );

  test( 'vcw cookie functions', function() {
    vcw.create_cookie( "vcw_test_cookie", "monster" );
    var cookie = vcw.read_cookie( "vcw_test_cookie" );
    equal( cookie, "monster", "Cookie create/read test." );
    // Return to null.
    vcw.create_cookie( "vcw_test_cookie", "" );
    }
  );

  // Setup for a test.
  function setupCreateEditor() {
    this.editor = new vcw.Editor()
    ok( this.editor, "Editor created." );
    }


  module( "Editor.", { setup: setupCreateEditor } );
  test( "Editor.selectKeymap()", function() {
    var previousKeymap = vcw.read_cookie( "vcw.editor.keymap" );
    this.editor.selectKeymap( "vim" );
    var codeMirror = this.editor.getCodeMirror(0);
    equal( codeMirror.getOption( "keyMap" ), "vim", "Keymap selection changed CodeMirror option." );
    if( previousKeymap )
      {
      vcw.create_cookie( "vcw.editor.keymap", previousKeymap, 365 );
      }
    }
  );

  test( "Editor.selectTheme()", function() {
    var previousTheme = vcw.read_cookie( "vcw.editor.theme" );
    this.editor.selectTheme( "elegant" );
    var codeMirror = this.editor.getCodeMirror(0);
    equal( codeMirror.getOption( "theme" ), "elegant", "Theme selection changed CodeMirror option." );
    if( previousTheme )
      {
      vcw.create_cookie( "vcw.editor.theme", previousTheme, 365 );
      }
    }
  );

  test( "Editor.generatePatch()", function() {
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

    // No commit message -- error!
    var patch = this.editor.generatePatch();
    expect( patch, null, "No patch without a commit message." );
    var commitMessage = 'A short summary of the patch.\n\n' +
      'A longer description of the patch.  This explanation will usually take up a\n' +
      'couple of lines.\n\n' +
      'It can also be made of multiple paragraphs.';
    this.editor.commitMessageEditor.setValue( commitMessage );

    var form = document.getElementById( "patchForm" );

    // No author name -- error!
    patch = this.editor.generatePatch();
    expect( patch, null, "No patch without an author name." );
    form.authorName.value = "Eric Corley";

    // No author email -- error!
    patch = this.editor.generatePatch();
    expect( patch, null, "No patch without an author email." );
    form.authorEmail.value = "kevin.mitnick@2600.com";

    patch = this.editor.generatePatch();

    var authorExpected = 'Author:  Eric Corley <kevin.mitnick@2600.com>';
    var authorReceived = patch.split( '\n', 1 );
    equal( authorReceived[0], authorExpected, 'Author line in the patch.' );

    var firstTwoLines = patch.split( '\n', 2 );
    var theRestStart = firstTwoLines[0].length + firstTwoLines[1].length + 2;

    var expected = 'Subject: [PATCH] A short summary of the patch.\n\n' +
      'A longer description of the patch.  This explanation will usually take up a\n' +
      'couple of lines.\n\n' +
      'It can also be made of multiple paragraphs.\n' +
      '---\n' +
      'Index: filename_diff.cxx\n' +
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
    equal( patch.substr( theRestStart ), expected, "The generated patch did what was expected." );
    }
  );

  test( "Editor.previewPatch()", function() {
    var codeMirror = this.editor.getCodeMirror(0);
    var previewSection = document.getElementById( "patchPreviewSection" );
    equal( previewSection.style.display, "none", "Preview section starts hidden." );

    // fill in some content
    var form = document.getElementById( "patchForm" );
    form.authorName.value = "Eric Corley";
    form.authorEmail.value = "kevin.mitnick@2600.com";
    var commitMessage = 'A short summary of the patch.\n\n' +
      'A longer description of the patch.  This explanation will usually take up a\n' +
      'couple of lines.\n\n' +
      'It can also be made of multiple paragraphs.';
    this.editor.commitMessageEditor.setValue( commitMessage );
    var filename = "mymod.py";
    var input1 = "input this";
    var input2 = "input that";
    var buffer = new editor.Buffer(filename, input1, filename, input2 );
    this.editor.buffers.push( buffer );

    this.editor.previewPatch();
    equal( previewSection.style.display, "block", "Preview section becomes visible." );
    }
  );
}; // end vcw.run_tests()
