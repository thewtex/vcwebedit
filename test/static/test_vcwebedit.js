// Everything lives in the vcw namespace.
var vcw = vcw || {};


/** Run all the tests. */
vcw.run_tests = function()
{
  var results = document.getElementById('vcwebedit-test-results');
  results.style.display = 'block';

  module("Utility functions.");

  test( 'vcw cookie functions', function()
    {
    vcw.create_cookie( "vcw_test_cookie", "monster" );
    var cookie = vcw.read_cookie( "vcw_test_cookie" );
    equal( cookie, "monster", "Cookie create/read test." );
    // Return to null.
    vcw.create_cookie( "vcw_test_cookie", "" );
    });
}; // end vcw.run_tests()
