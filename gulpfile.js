'use strict';

const concat = require('gulp-concat');
const gulp = require('gulp');
const metal = require('gulp-metal');
const runSequence = require('run-sequence');
const sourcemaps = require('gulp-sourcemaps');

let options = {
  globalName: 'wedeploy',
  buildSrc: ['src/**/!(node)/*.js', '!src/env/node.js'],
  bundleFileName: 'api.js',
  mainBuildJsTasks: ['build:js:all'],
  dest: 'build/globals',
  rollupConfig: {
    exports: 'named',
  },
  src: 'src/env/browser.js',
  testNodeSrc: [
    'test/environment/node/env.js',
    'test/**/*.js',
    '!test/**/browser/**/*.js',
  ],
  testSaucelabsBrowsers: {
    sl_chrome: {
      base: 'SauceLabs',
      browserName: 'chrome',
    },
    sl_safari_9: {
      base: 'SauceLabs',
      browserName: 'safari',
      version: '9',
    },
    sl_firefox: {
      base: 'SauceLabs',
      browserName: 'firefox',
    },
    sl_ie_10: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 7',
      version: '10',
    },
    sl_ie_11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8.1',
      version: '11',
    },
    sl_edge_20: {
      base: 'SauceLabs',
      browserName: 'microsoftedge',
      platform: 'Windows 10',
      version: '13',
    },
    sl_edge_21: {
      base: 'SauceLabs',
      browserName: 'microsoftedge',
      platform: 'Windows 10',
      version: '14',
    },
    sl_iphone: {
      base: 'SauceLabs',
      browserName: 'iphone',
      platform: 'OS X 10.10',
      version: '9.2',
    },
    sl_android_4: {
      base: 'SauceLabs',
      browserName: 'android',
      platform: 'Linux',
      version: '4.4',
    },
    sl_android_5: {
      base: 'SauceLabs',
      browserName: 'android',
      platform: 'Linux',
      version: '5.0',
    },
  },

  // See the `build:es2015` task for more information.
  uglifySrc: 'build/!(es2015)/**.js',
  useEslint: true,
};
metal.registerTasks(options);

/* eslint-disable no-console,require-jsdoc */
gulp.task('ci', function(cb) {
  if (process.env.SAUCE_USERNAME) {
    return runSequence('lint', 'test:saucelabs', 'test:node', 'build', cb);
  }
  console.warn('Not running tests (most likely due to security restrictions)');
  console.warn('See https://docs.travis-ci.com/user/sauce-connect/ for help');
  cb();
});

gulp.task('build:socket', function(done) {
  return runSequence('build:socket:globals', 'build:socket:es2015', done);
});

gulp.task('build:socket:globals', function() {
  return concatSocket('build/globals/api.js', 'build/globals');
});

gulp.task('build:socket:es2015', function() {
  return concatSocket('build/es2015/api.js', 'build/es2015');
});

function concatSocket(filePath, dest) {
  return gulp
    .src(['node_modules/socket.io-client/dist/socket.io.js', filePath])
    .pipe(
      sourcemaps.init({
        loadMaps: true,
      })
    )
    .pipe(concat('api.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest));
}