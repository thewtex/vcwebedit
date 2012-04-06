// Everything lives in the vcw namespace.
var vcw = vcw || {};


/** Create a browser cookie.  If path is not set, then it defaults to '/'.
 */
vcw.create_cookie = function ( cookie_name, value, expiration_days, path ) {
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

vcw.read_cookie = function ( desired_cookie_name ) {
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
vcw.Editor = function() {
  // Clear the default, which is the path to the document.
  $('#vcw.editor').html("");

  // Start with one empty editor.
  this.codeMirrorEditors = [CodeMirror( document.getElementById( "vcw.editor" ), {
      mode:  "rst",
      lineWrapping: true,
      lineNumbers: true
      })];

  this.commitMessageEditor = CodeMirror( document.getElementById( "vcw.commitMessage" ), {
    lineWrapping: true,
    mode: "text/plain",
    value: ""
    });
  this.commitMessageEditor.getScrollerElement().style.height = "15em";
  this.commitMessageEditor.refresh();

  this.patchPreviewEditor = CodeMirror.fromTextArea( document.getElementById( "vcw.patchPreviewText" ), {
    lineWrapping: true,
    mode: "text/plain",
    readOnly: "nocursor"
    });

  // The buffers members holds all the files being edited.
  this.buffers = [];

  this.Buffer = function(original_path, original_buffer, modified_path, modified_buffer)
    {
    this.original_path = original_path;
    this.original_buffer = original_buffer;
    this.modified_path = modified_path;
    this.modified_buffer = modified_buffer;
    }
}

/** Get one of the internal CodeMirror editor instances.
 *
 * \param idx The index of the CodeMirror instance.  Defaults to 0.
 *
 * Method on the Editor object.
 */
vcw.Editor.prototype.getCodeMirror = function( idx ) {
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
vcw.Editor.prototype.loadFile = function( url, editorIdx ) {
  if( editorIdx == null )
    {
    editorIdx = 0;
    }
  var editor = this.codeMirrorEditors[editorIdx];

  var ii;
  var has_buf = new Boolean( false );
  for( ii = 0; ii < this.buffers.length; ++ii )
    {
    if( this.buffers[ii].original_path == url )
      {
      has_buf = true;
      break;
      }
    }
  if( has_buf.valueOf() )
    {
    editor.setValue( this.buffers[ii].modified_buffer );
    }

  var Buffer = this.Buffer;
  var buffers = this.buffers;
  $.get(url, function( data )
    {
    editor.setValue( data );
    var buf = new Buffer( url, data, url, data );
    buffers.push( buf );
    });
}

/** Select a different keymap.
 *
 * Uses the keymap argument or the values of the element with id vcw.keymapSelection
 *
 * Method on the Editor object.
 */
vcw.Editor.prototype.selectKeymap = function( keymap ) {
  if( !keymap )
    {
    keymap = document.getElementById( "vcw.keymapSelection" ).value;
    }

  var ii;
  for( ii = 0; ii < this.codeMirrorEditors.length; ++ii )
    {
    this.codeMirrorEditors[ii].setOption( "keyMap", keymap );
    }
  this.commitMessageEditor.setOption( "keyMap", keymap );
  vcw.create_cookie( "vcw.editor.keymap", keymap, 365 );
}

/** Select a different theme.
 *
 * Uses the theme argument or the values of the element with id vcw.themeSelection
 *
 * Method on the Editor object.
 */
vcw.Editor.prototype.selectTheme = function( theme ) {

  if( !theme )
    {
    theme = document.getElementById( "vcw.themeSelection" ).value;
    }

  var ii;
  for( ii = 0; ii < this.codeMirrorEditors.length; ++ii )
    {
    this.codeMirrorEditors[ii].setOption( "theme", theme );
    }
  this.commitMessageEditor.setOption( "theme", theme );
  this.patchPreviewEditor.setOption( "theme", theme );
  vcw.create_cookie( "vcw.editor.theme", theme, 365 );
}

/** Generate a patch from the modified files.
 *
 * Returns a unified diff with version control metadata
 *
 * Method on the Editor object.
 */
vcw.Editor.prototype.generatePatch = function() {
  var errorMessage = document.getElementById( "vcw.errorMessage" );

  var commitMessage = this.commitMessageEditor.getValue();
  if( ! commitMessage )
    {
    errorMessage.innerHTML = "Please enter a commit message.";
    errorMessage.style.display = "block";
    return null;
    }

  var form = document.getElementById( "patchForm" );

  var authorName = form.authorName.value;
  if( ! authorName )
    {
    errorMessage.innerHTML = "Please enter an author name.";
    errorMessage.style.display = "block";
    return null;
    }

  var authorEmail = form.authorEmail.value;
  if( ! authorEmail )
    {
    errorMessage.innerHTML = "Please enter an author email.";
    errorMessage.style.display = "block";
    return null;
    }

  var patch = '';
  patch += 'Author:  ' + authorName + ' <' + authorEmail + '>\n';
  var currentDate = new Date();
  var daysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  patch += 'Date:    ' + daysOfTheWeek[currentDate.getUTCDay()];
  patch += ', ' + currentDate.getUTCDate() + ' ' + currentDate.getUTCFullYear();
  patch += ' ' + currentDate.getUTCFullYear();
  var hours = currentDate.getUTCHours();
  if( hours < 10 )
    {
    patch += '0';
    }
  patch += hours + ':';
  var minutes = currentDate.getUTCMinutes();
  if( minutes < 10 )
    {
    patch += '0';
    }
  patch += minutes + ':';
  var seconds = currentDate.getUTCSeconds();
  if( seconds < 10 )
    {
    patch += '0';
    }
  patch += seconds;
  var timezoneOffset = currentDate.getTimezoneOffset();
  if( timezoneOffset < 0 )
    {
    patch += '0';
    }
  else
    {
    patch += '-0';
    }
  patch += timezoneOffset / -60 + '00\n';

  patch += 'Subject: [PATCH] ' + commitMessage;
  patch += '\n---\n';

  var ii;
  var buf;
  var old_header;
  var new_header;
  for( ii = 0; ii < this.buffers.length; ++ii )
    {
    buf = this.buffers[ii];
    old_header = "a/" + buf.original_path;
    new_header = "b/" + buf.modified_path;
    patch += JsDiff.createPatch( buf.original_path, buf.original_buffer, buf.modified_buffer, old_header, new_header );
    }

  errorMessage.style.display = "none";

  return patch;
}

/** Create a preview of the patch.
 *
 * Shows the patch preview div and the patch content.
 *
 * Method on the Editor object.
 */
vcw.Editor.prototype.previewPatch = function () {
  var patch = this.generatePatch();
  if( patch )
    {
    var previewSection = document.getElementById( "vcw.patchPreviewSection" );
    previewSection.style.display = "block";

    this.patchPreviewEditor.setValue( patch );
    }
}

function vcw_savePatchLocally() {
   var input = 'Welcome to the National Library of Medicine Insight Segmentation and Registration Toolkit (ITK).\n' +
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

   console.log( input );

   var input2 = 'Welcome to the National Library of Medicine Insight Segmentation and Registration Toolkit (ITK).\n'  +
              'ITK is an open-source, cross-platform system that provides developers with an extensive suite of software tools for image analysis.\n' +
              'Developed through extreme programming methodologies, ITK employs leading-edge algorithms for processing, registering and segmenting multidimensional data.\n' +
              'The goals for ITK include:';

  console.log( input2 );

  console.log( "*** patch ***" );

  var filename = "filename_diff.cxx";

  var patch = JsDiff.createPatch( filename, input, input2, "", "" );

  console.log( "patch" );
  console.log( patch );

/*
  var author_name = "ITK Examples";
  var author_email =  "itkexamples@gmail.com";
  var hash = "e6fd25df3cb345aa7cb190416c2f1329acc25458";

  var commit_description = "Here is the commit title";
  var commit_message = "Here is a longer and more explanatory message.\n This message can be spanned over paragraphs.";

  console.log( "From " + hash + " " + Date() ); // change Date by one generated hash (based on the diff)
  console.log( "From: " + author_name + " <" + author_email + ">" );
  console.log( "Date:   " + Date() );
  console.log( "Subject: [PATCH 1/1] " + commit_description );
  console.log( "" );
  console.log( commit_message );
  console.log( "" );

  var patchs = Diff.diff_patch( t1, t2 );
  var number_of_deletions = 0;
  var number_of_insertions = 0;

  for( i = 0; i < patchs.length; i++ )
    {
    number_of_deletions   = number_of_deletions   + patchs[i].file1.length;
    number_of_insertions  = number_of_insertions  + patchs[i].file2.length;
    }

  var number_of_changes = number_of_deletions + number_of_insertions;

  console.log( "---" );
  console.log( "/path/to/file     | " + number_of_changes + "+-" );
  console.log( "1 file changed, " + number_of_insertions + " insertions(+), " + number_of_deletions + " deletions(-)" );
  console.log( "" );

  console.log( "diff --git a/path/to/file b/path/to/file" );
  console.log( "index e6fd25df3cb345aa7cb190416c2f1329acc25458 100644" );
  console.log( "--- a/path/to/file" );
  console.log( "+++ b/path/to/file" );


  for( var i = 0; i < patchs.length; i++ )
    {
    console.log( "@@ -" + patchs[i].file1.offset + "," + patchs[i].file1.chunk.length + " +" +
                 patchs[i].file2.offset + "," + patchs[i].file2.chunk.length + " @@" );

    var j;

    for( j = 0; j < patchs[i].file1.chunk.length; j++ )
      {
      console.log( "- " + patchs[i].file1.chunk[j] );
      }

    for( j = 0; j < patchs[i].file2.chunk.length; j++ )
      {
      console.log( "+ " + patchs[i].file2.chunk[j] );
      }
    console.log( "" );
    }

  console.log( "1.7.9" ); // git version
*/
}

