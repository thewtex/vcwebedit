function test_vcwebedit()
{
  var results = document.getElementById('vcwebedit-test-results');
  results.style.display = 'block';

  test("a basic test example", function() {
    ok( true, "this test is fine" );
    var value = "hello";
    equal( value, "hello", "We expect value to be hello" );
  });

  module("Module A");

  test("first test within module", function() {
    ok( true, "all pass" );
  });

  test("second test within module", function() {
    ok( true, "all pass" );
  });

  module("Module B");

  test("some other test", function() {
    expect(2);
    equal( true, false, "failing test" );
    equal( true, true, "passing test" );
  });
}; // end test_vcwebedit()
