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

metal.registerTasks({
	globalName: 'launchpad',
	buildSrc: ['src/**/!(node)/*.js'],
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
			compilers: [require('babel-core/register')]
		}));
});

gulp.task('test:node:cover', function() {
	return gulp.src(['src/**/*.js'])
		.pipe(istanbul({
			instrumenter: isparta.Instrumenter,
			includeUntested: true
		}))
		.pipe(istanbul.hookRequire());
});

gulp.task('test:node:coverage', ['test:node:cover'], function() {
	var files = [
		'src/**/*.js',
		'test/enviroment/node/env.js',
		'test/**/*.js',
		'!src/**/browser/**/*.js',
		'!test/**/browser/**/*.js'
	];
	return gulp.src(files)
		.pipe(mocha({
			compilers: [require('babel-core/register')]
		}))
		.pipe(istanbul.writeReports({
			dir: './coverage/node'
		}));
});

gulp.task('ci', ['lint', 'test:node', 'test:saucelabs', 'build:node', 'build']);

gulp.task('build:node', function() {
	function build(src, dest) {
		return gulp.src(src)
			.pipe(babel())
			.pipe(gulp.dest(dest));
	}

	return merge(
		build('bower_components/metal/**/*.js', 'build/node/bower_components/metal'),
		build('bower_components/metal-ajax/**/*.js', 'build/node/bower_components/metal-ajax'),
		build('bower_components/metal-multimap/**/*.js', 'build/node/bower_components/metal-multimap'),
		build('bower_components/metal-promise/**/*.js', 'build/node/bower_components/metal-promise'),
		build('src/**/!(browser)/*.js', 'build/node/src'),
		build('envs/node.js', 'build/node/envs')
	);
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
	runSequence('build:globals', 'build:min', cb);
});

gulp.task('watch', ['watch:globals']);
