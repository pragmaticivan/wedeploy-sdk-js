var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var metal = require('gulp-metal');

metal.registerTasks({
	globalName: 'launchpad',
	bundleFileName: 'api.js'
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
