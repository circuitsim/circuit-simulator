var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var jade = require('gulp-jade');
var connect = require('gulp-connect');

var outDir = 'dev_build';

function handleError(err) {
  console.error(err);
  this.emit('end');
}

gulp.task('templates', function() {
  gulp.src('demo/*.jade')
    .pipe(jade())
    .pipe(gulp.dest(outDir));
});

gulp.task('demo-styles', function() {
  gulp.src('demo/*.css')
    .pipe(gulp.dest(outDir));
});

function compile(opts) {
  var bundler = watchify(browserify('./demo/demo.js', { debug: true })
    .transform(babel));

  function rebundle() {
    bundler.bundle()
      .on('error', handleError)
      .pipe(source('demo.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(outDir))
      .pipe(connect.reload());
  }

  if (opts.watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }

  rebundle();
}

gulp.task('connect', function() {
  connect.server({
    root: 'dev_build',
    livereload: true
  });
});

gulp.task('watch', function() {
  compile({watch: true});
});

gulp.task('default', ['templates', 'demo-styles', 'connect', 'watch']);
