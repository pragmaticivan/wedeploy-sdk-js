'use strict';

var concat = require('gulp-concat');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var metal = require('gulp-metal');
var sourcemaps = require('gulp-sourcemaps');

metal.registerTasks({
	globalName: 'wedeploy',
	buildSrc: ['src/**/!(node)/*.js', '!src/env/node.js'],
	bundleFileName: 'api.js',
	mainBuildJsTasks: ['build:globals:js', 'build:socket'],
	testNodeSrc: [
		'test/enviroment/node/env.js',
		'test/**/*.js',
		'!test/**/browser/**/*.js'
	],
	testSaucelabsBrowsers: {
		sl_chrome: {
			base: 'SauceLabs',
			browserName: 'chrome'
		},
		sl_safari_8: {
			base: 'SauceLabs',
			browserName: 'safari',
			version: '8'
		},
		sl_safari_9: {
			base: 'SauceLabs',
			browserName: 'safari',
			version: '9'
		},
		sl_firefox: {
			base: 'SauceLabs',
			browserName: 'firefox'
		},
		sl_ie_10: {
			base: 'SauceLabs',
			browserName: 'internet explorer',
			platform: 'Windows 7',
			version: '10'
		},
		sl_ie_11: {
			base: 'SauceLabs',
			browserName: 'internet explorer',
			platform: 'Windows 8.1',
			version: '11'
		},
		sl_edge_20: {
			base: 'SauceLabs',
			browserName: 'microsoftedge',
			platform: 'Windows 10',
			version: '20'
		},
		sl_iphone: {
			base: 'SauceLabs',
			browserName: 'iphone',
			platform: 'OS X 10.10',
			version: '9.2'
		},
		sl_android_4: {
			base: 'SauceLabs',
			browserName: 'android',
			platform: 'Linux',
			version: '4.4'
		},
		sl_android_5: {
			base: 'SauceLabs',
			browserName: 'android',
			platform: 'Linux',
			version: '5.0'
		}
	}
});

gulp.task('ci', function(cb) {
	if (process.env.SAUCE_USERNAME) {
		return runSequence('lint', 'test:node', 'test:saucelabs', 'build', cb);
	}
	console.warn('Not running tests (most likely due to security restrictions)');
	console.warn('See https://docs.travis-ci.com/user/sauce-connect/ for help');
	cb();
});

gulp.task('build:socket', function() {
	return gulp.src(['node_modules/socket.io-client/socket.io.js', 'build/globals/api.js'])
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(concat('api.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('build/globals'));
});
