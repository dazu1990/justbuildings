'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  // defaultAssets = require('./config/assets/default'),
  // testAssets = require('./config/assets/test'),
  config = require('./config.json');

var src = {
  client: [
    './src/modules/core/app.js',
    './src/modules/*/init.js',
    './src/modules/**/*.js'
  ],
  tests: ['./src/modules/*/tests/**/*.js'],
  views: ['./src/modules/**/*.html']
}

// Karma configuration
module.exports = function(karmaConfig) {
  karmaConfig.set({
    // Frameworks to use
    frameworks: ['jasmine'],

    preprocessors: {
      'src/modules/**/*.html': 'ng-html2js'
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'src/',
      moduleName: 'template-module'
    },

    // List of files / patterns to load in the browser
    files: _.union(config.js.lib, config.js.tests, src.client, src.tests, src.views),



    // Test results reporter to use
    reporters: ['spec'],

    // Web server port
    port: 9876,

    // Enable / disable colors in the output (reporters and logs)
    colors: true,

    // Level of logging
    // Possible values: karmaConfig.LOG_DISABLE || karmaConfig.LOG_ERROR || karmaConfig.LOG_WARN || karmaConfig.LOG_INFO || karmaConfig.LOG_DEBUG
    logLevel: karmaConfig.LOG_INFO,

    // Enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    // Continuous Integration mode
    // If true, it capture browsers, run tests and exit
    singleRun: true
  });
};
