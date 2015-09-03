var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var jade = require('gulp-jade');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var envify = require('envify/custom');

var buildDir = 'build';
var devBuildDir = 'dev_build';

function handleError(err) {
  console.error(err); // eslint-disable-line no-console
  this.emit('end');
}

function templates(outDir) {
  return function() {
    return gulp.src('demo/*.jade')
      .pipe(jade())
      .pipe(gulp.dest(outDir));
  };
}

gulp.task('templates', templates(devBuildDir));

function compile(opts) {
  var bundler = watchify(browserify('./demo/demo.js', { debug: true })
    .transform(babel));

  function rebundle() {
    return bundler.bundle()
      .on('error', handleError)
      .pipe(source('demo.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(devBuildDir))
      .pipe(connect.reload());
  }

  if (opts.watch) {
    bundler.on('update', function() {
      console.log('-> bundling...'); // eslint-disable-line no-console
      return rebundle();
    });
  }

  return rebundle();
}

gulp.task('connect', function() {
  return connect.server({
    root: devBuildDir,
    livereload: true
  });
});

gulp.task('watch', function() {
  return compile({watch: true});
});

gulp.task('build', function() {
  templates(buildDir)();
  return browserify('./demo/demo.js')
    .transform(envify({
      NODE_ENV: 'production'
    }), {global: true})
    .transform(babel)
    .bundle().on('error', handleError)
    .pipe(source('demo.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(buildDir));
});

gulp.task('default', ['templates', 'connect', 'watch']);
