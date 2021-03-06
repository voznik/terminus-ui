module.exports = function(config) {

  var libBase = 'src/lib/'; // transpiled app JS and map files

  var customLaunchers = {
    'Win_10_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: '56.0',
      platform: 'Windows 10'
    },
    'Win_10_Edge': {
      base: 'SauceLabs',
      browserName: 'MicrosoftEdge',
      version: '14.14393',
      platform: 'Windows 10'
    },
    'MacOS_Chrome': {
      base: 'SauceLabs',
      browserName: 'Chrome',
      version: '56.0',
      platform: 'macOS 10.12'
    },
    'MacOS_Safari': {
      base: 'SauceLabs',
      browserName: 'safari',
      version: '10.0',
      platform: 'macOS 10.12'
    }
  };

  config.set({
    basePath: '',
    frameworks: ['jasmine'],

    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('karma-remap-coverage'),
      require('karma-sauce-launcher'),
    ],

    client: {
      builtPaths: [libBase], // add more spec base paths as needed
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },

    files: [
      // System.js for module loading
      'node_modules/systemjs/dist/system.src.js',

      // Polyfills
      'node_modules/core-js/client/shim.js',

      // zone.js
      'node_modules/zone.js/dist/zone.js',
      'node_modules/zone.js/dist/long-stack-trace-zone.js',
      'node_modules/zone.js/dist/proxy.js',
      'node_modules/zone.js/dist/sync-test.js',
      'node_modules/zone.js/dist/jasmine-patch.js',
      'node_modules/zone.js/dist/async-test.js',
      'node_modules/zone.js/dist/fake-async-test.js',

      // RxJs
      { pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false },
      { pattern: 'node_modules/rxjs/**/*.js.map', included: false, watched: false },

      // Paths loaded via module imports:
      // Angular itself
      { pattern: 'node_modules/@angular/**/*.js', included: false, watched: false },
      { pattern: 'node_modules/@angular/**/*.js.map', included: false, watched: false },

      // Ladda
      { pattern: 'node_modules/angular2-ladda/**/*.js', included: false, watched: false },
      { pattern: 'node_modules/angular2-ladda/**/*.js.map', included: false, watched: false },
      { pattern: 'node_modules/ladda/**/*.js', included: false, watched: false },

      { pattern: 'node_modules/lodash/*.js', included: false, watched: false },

      // Material styles
      { pattern: 'node_modules/@angular/material/prebuilt-themes/deeppurple-amber.css', included: true, watched: true },

      'tooling/karma-test-shim.js', // optionally extend SystemJS mapping e.g., with barrels

      // Add hammerjs
      'node_modules/hammerjs/hammer.min.js',

      // transpiled application & spec code paths loaded via module imports
      { pattern: libBase + '**/*.js', included: false, watched: true },

      // Asset (HTML & CSS) paths loaded via Angular's component compiler
      // (these paths need to be rewritten, see proxies section)
      { pattern: libBase + '**/*.html', included: false, watched: true },
      { pattern: libBase + '**/*.css', included: false, watched: true },

      // Paths for debugging with source maps in dev tools
      { pattern: libBase + '**/*.ts', included: false, watched: false },
      { pattern: libBase + '**/*.js.map', included: false, watched: false }
    ],

    // Proxied base paths for loading assets
    proxies: {
      // required for modules fetched by SystemJS
      '/base/src/lib/node_modules/': '/base/node_modules/',
    },

    exclude: [
    ],

    preprocessors: {
      'src/lib/**/!(systemjs-angular-loader|*.spec).js': ['coverage'],
    },
    reporters: ['progress', 'kjhtml', 'coverage', 'remap-coverage', 'saucelabs'],
    coverageReporter: {
      type: 'in-memory'
    },
    remapCoverageReporter: {
      'text-summary': null, // to show summary in console
      'html': './coverage/html/',
      'text-lcov': './coverage/lcov/',
      'json': './coverage/coverage.json',
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,

    /*
     * FIXME: Disabled for now. SauceLabs keeps timing out.
     *browsers: config.sauceLabs ? Object.keys(customLaunchers) : ['Chrome'],
     */
    browsers: ['Chrome'],

    sauceLabs: {
      testName: 'Terminus UI CI Tests'
    },
    captureTimeout: 120000,
    concurrency: 2,
    customLaunchers: customLaunchers,

    singleRun: false
  })
}
