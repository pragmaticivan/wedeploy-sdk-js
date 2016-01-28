var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var isparta = require('isparta');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var metal = require('gulp-metal');
var mocha = require('gulp-mocha');
var babel = require('gulp-babel');
var merge = require('merge-stream');
var path = require('path');

metal.registerTasks({
	globalName: 'launchpad',
	buildSrc: ['src/**/!(node)/*.js', 'src/**/!(node)/env.js'],
	bundleFileName: 'api.js',
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

gulp.task('test:node', function() {
	var files = [
		'src/**/*.js',
		'test/enviroment/node/env.js',
		'test/**/*.js',
		'!src/**/browser/**/*.js',
		'!test/**/browser/**/*.js'
	];
	return gulp.src(files)
		.pipe(mocha({
			compilers: [require('babel-core/register')({
				ignore: false,
				sourceMaps: 'both'
			})]
		}));
});

gulp.task('ci', function(cb) {
	if (process.env.SAUCE_USERNAME) {
		return runSequence('lint', 'test:node', 'test:saucelabs', 'build:node', 'build', cb);
	}
	console.warn('Not running tests (most likely due to security restrictions)');
	console.warn('See https://docs.travis-ci.com/user/sauce-connect/ for help');
	cb();
});

gulp.task('build:node', function() {
	var globs = [
		'src/**/!(browser)/*.js',
		'node_modules/metal*/**/*.js',
		'!node_modules/metal-tools*/**/*.js',
		'!node_modules/metal-karma*/**/*.js',
		'!node_modules/metal-jquery-adapter/**/*.js'
	];
	return gulp.src(globs, {base: process.cwd()})
		.pipe(babel({
			presets: ['metal'],
			resolveModuleSource: function(originalPath, filename) {
				if (originalPath[0] !== '.' && originalPath[0] !== '/' && originalPath.startsWith('metal')) {
					// We need to change the imports for metal code to point to the compiled version.
					return path.join(path.relative(path.dirname(filename), path.resolve('node_modules')), originalPath);
				} else {
					return originalPath;
				}
			}
		}))
		.pipe(gulp.dest('build/node'));
});

gulp.task('build:min', function() {
	return gulp.src('build/api.js')
		.pipe(uglify())
		.pipe(rename(function(path) {
			path.basename += '-min';
		}))
		.pipe(gulp.dest('build'));
});

gulp.task('build', function(cb) {
	runSequence('build:globals', cb);
});

gulp.task('watch', ['watch:globals']);
