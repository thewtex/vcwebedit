// Load the file into the editor interface.
function vcw_editFile(url)
{
  $.get(url, function(data) {
    // Clear the default, which is the path to the document.
    $('#editor').html("");
    var myCodeMirror = CodeMirror(document.getElementById("editor"), {
      value: data,
      mode:  "rst",
      lineNumbers: true
      });
    });
}
