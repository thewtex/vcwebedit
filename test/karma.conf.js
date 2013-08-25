// Karma configuration
// Generated on Sat Aug 24 2013 19:56:36 GMT-0400 (EDT)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '../doc/_build/html/',


    // frameworks to use
    frameworks: ['qunit'],


    // list of files / patterns to load in the browser
    files: [
      '_edit_index.html',
      '_static/**/*.css',
      '_static/proBlue.css',
      '_static/jquery.js',
      '_static/jsdiff/diff.js',
      '_static/codemirror/lib/codemirror.js',
      '_static/codemirror/keymap/emacs.js',
      '_static/codemirror/keymap/vim.js',
      '_static/codemirror/mode/rst/rst.js',
      '_static/vcwebedit.js',
      '_static/test_vcwebedit.js',
      '_static/tests_main.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome', 'Firefox'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Convert the HTML files in JS strings and publish them in the global
    // window.__html__
    preprocessors: {
      '**/*.html': ['html2js']
           },


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
