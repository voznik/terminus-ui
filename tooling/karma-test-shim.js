// /*global jasmine, __karma__, window*/
Error.stackTraceLimit = 0; // "No stacktrace"" is usually best for testing.

// Uncomment to get full stacktrace output. Sometimes helpful, usually not.
/*
 *Error.stackTraceLimit = Infinity;
 */

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

// builtPaths: root paths for output ("built") files
// get from karma.config.js, then prefix with '/base/' (default is 'src/')
var builtPaths = (__karma__.config.builtPaths || ['src/'])
                 .map(function(p) {return '/base/' + p;});

__karma__.loaded = function() { };

function isJsFile(path) {
  return path.slice(-3) == '.js';
}

function isSpecFile(path) {
  return /\.spec\.(.*\.)?js$/.test(path);
}

// Is a "built" file if is JavaScript file in one of the "built" folders
function isBuiltFile(path) {
  return isJsFile(path) &&
         builtPaths.reduce(function(keep, bp) {
           return keep || (path.substr(0, bp.length) === bp);
         }, false);
}

var allSpecFiles = Object.keys(window.__karma__.files)
  .filter(isSpecFile)
  .filter(isBuiltFile);

System.config({
  paths: {
    // paths serve as alias
    'npm:': 'node_modules/',
  },
  // Base URL for System.js calls. 'base/' is where Karma serves files from.
  baseURL: 'base/src/lib',

  // Extend usual application package list with test folder
  packages: {
    '': {
      defaultExtension: 'js'
    },
    'rxjs': {
      defaultExtension: 'js'
    },
    'angular2-ladda': {
      main: 'module.js',
      defaultExtension: 'js',
    },
    'ladda': {
      main: 'ladda.js',
      defaultExtension: 'js',
    },
    'src': {
      defaultExtension: 'js',
      meta: {
        './*.js': {
          loader: 'system-loader',
        },
      },
    },
  },

  // Map the angular umd bundles
  map: {
    'system-loader': 'systemjs-angular-loader.js',

    '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
    '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
    '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
    '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
    '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
    '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
    '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',

    '@angular/animations': 'npm:@angular/animations/bundles/animations.umd.js',
    '@angular/animations/browser': 'npm:@angular/animations/bundles/animations-browser.umd.js',
    '@angular/platform-browser/animations': 'npm:@angular/platform-browser/bundles/platform-browser-animations.umd',
    '@angular/flex-layout': 'npm:@angular/flex-layout/bundles/flex-layout.umd',

    // Testing bundles
    '@angular/core/testing': 'npm:@angular/core/bundles/core-testing.umd.js',
    '@angular/common/testing': 'npm:@angular/common/bundles/common-testing.umd.js',
    '@angular/compiler/testing': 'npm:@angular/compiler/bundles/compiler-testing.umd.js',
    '@angular/platform-browser/testing': 'npm:@angular/platform-browser/bundles/platform-browser-testing.umd.js',
    '@angular/platform-browser-dynamic/testing': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js',
    '@angular/http/testing': 'npm:@angular/http/bundles/http-testing.umd.js',
    '@angular/router/testing': 'npm:@angular/router/bundles/router-testing.umd.js',
    '@angular/forms/testing': 'npm:@angular/forms/bundles/forms-testing.umd.js',

    // Material
    '@angular/material': 'npm:@angular/material/bundles/material.umd.js',
    '@angular/material/autocomplete': 'npm:@angular/material/bundles/material-autocomplete.umd.js',
    '@angular/material/button-toggle': 'npm:@angular/material/bundles/material-button-toggle.umd.js',
    '@angular/material/button': 'npm:@angular/material/bundles/material-button.umd.js',
    '@angular/material/card': 'npm:@angular/material/bundles/material-card.umd.js',
    '@angular/material/checkbox': 'npm:@angular/material/bundles/material-checkbox.umd.js',
    '@angular/material/chips': 'npm:@angular/material/bundles/material-chips.umd.js',
    '@angular/material/core': 'npm:@angular/material/bundles/material-core.umd.js',
    '@angular/material/datepicker': 'npm:@angular/material/bundles/material-datepicker.umd.js',
    '@angular/material/dialog': 'npm:@angular/material/bundles/material-dialog.umd.js',
    '@angular/material/expansion': 'npm:@angular/material/bundles/material-expansion.umd.js',
    '@angular/material/form-field': 'npm:@angular/material/bundles/material-form-field.umd.js',
    '@angular/material/grid-list': 'npm:@angular/material/bundles/material-grid-list.umd.js',
    '@angular/material/icon': 'npm:@angular/material/bundles/material-icon.umd.js',
    '@angular/material/input': 'npm:@angular/material/bundles/material-input.umd.js',
    '@angular/material/list': 'npm:@angular/material/bundles/material-list.umd.js',
    '@angular/material/menu': 'npm:@angular/material/bundles/material-menu.umd.js',
    '@angular/material/paginator': 'npm:@angular/material/bundles/material-paginator.umd.js',
    '@angular/material/progress-bar': 'npm:@angular/material/bundles/material-progress-bar.umd.js',
    '@angular/material/progress-spinner': 'npm:@angular/material/bundles/material-progress-spinner.umd.js',
    '@angular/material/radio': 'npm:@angular/material/bundles/material-radio.umd.js',
    '@angular/material/select': 'npm:@angular/material/bundles/material-select.umd.js',
    '@angular/material/sidenav': 'npm:@angular/material/bundles/material-sidenav.umd.js',
    '@angular/material/slide-toggle': 'npm:@angular/material/bundles/material-slide-toggle.umd.js',
    '@angular/material/slider': 'npm:@angular/material/bundles/material-slider.umd.js',
    '@angular/material/snack-bar': 'npm:@angular/material/bundles/material-snack-bar.umd.js',
    '@angular/material/sort': 'npm:@angular/material/bundles/material-sort.umd.js',
    '@angular/material/stepper': 'npm:@angular/material/bundles/material-stepper.umd.js',
    '@angular/material/table': 'npm:@angular/material/bundles/material-table.umd.js',
    '@angular/material/tabs': 'npm:@angular/material/bundles/material-tabs.umd.js',
    '@angular/material/toolbar': 'npm:@angular/material/bundles/material-toolbar.umd.js',
    '@angular/material/tooltip': 'npm:@angular/material/bundles/material-tooltip.umd.js',

    // CDK
    '@angular/cdk': 'npm:@angular/cdk/bundles/cdk.umd.js',
    '@angular/cdk/a11y': 'npm:/@angular/cdk/bundles/cdk-a11y.umd.js',
    '@angular/cdk/bidi': 'npm:/@angular/cdk/bundles/cdk-bidi.umd.js',
    '@angular/cdk/observers': 'npm:/@angular/cdk/bundles/cdk-observers.umd.js',
    '@angular/cdk/overlay': 'npm:/@angular/cdk/bundles/cdk-overlay.umd.js',
    '@angular/cdk/portal': 'npm:/@angular/cdk/bundles/cdk-portal.umd.js',
    '@angular/cdk/scrolling': 'npm:/@angular/cdk/bundles/cdk-scrolling.umd.js',
    '@angular/cdk/platform': 'npm:/@angular/cdk/bundles/cdk-platform.umd.js',
    '@angular/cdk/keycodes': 'npm:/@angular/cdk/bundles/cdk-keycodes.umd.js',
    '@angular/cdk/coercion': 'npm:/@angular/cdk/bundles/cdk-coercion.umd.js',
    '@angular/cdk/collections': 'npm:/@angular/cdk/bundles/cdk-collections.umd.js',
    '@angular/cdk/rxjs': 'npm:/@angular/cdk/bundles/cdk-rxjs.umd.js',
    '@angular/cdk/table': 'npm:/@angular/cdk/bundles/cdk-table.umd.js',
    '@angular/cdk/stepper': 'npm:/@angular/cdk/bundles/cdk-stepper.umd.js',

    // other libraries
    'rxjs': 'npm:rxjs',
    'angular2-ladda': 'npm:angular2-ladda/module',
    'ladda': 'npm:ladda/js',
    'spin': 'npm:ladda/js/spin.js',

    'lodash': 'npm:lodash/index.js',

    'src': 'src',
  },
});

// START
initTestBed().then(initTesting);

// Initialize the TestBed
function initTestBed() {
  return Promise.all([
    System.import('@angular/core/testing'),
    System.import('@angular/platform-browser-dynamic/testing')
  ])
  .then(function(providers) {
    var coreTesting = providers[0];
    var browserTesting = providers[1];

    coreTesting.TestBed.initTestEnvironment(
      browserTesting.BrowserDynamicTestingModule,
      browserTesting.platformBrowserDynamicTesting()
    );
  })
}

// Import all spec files and start karma
function initTesting() {
  return Promise.all(
    allSpecFiles.map(function(moduleName) {
      return System.import(moduleName);
    })
  )
  .then(__karma__.start, __karma__.error);
}

