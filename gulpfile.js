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
var file = require('gulp-file');

var buildDir = 'build';
var devBuildDir = 'dev_build';

function handleError(err) {
  console.error(err); // eslint-disable-line no-console
  this.emit('end');
}

function templates(outDir) {
  return function() {
    return gulp.src('public/*.jade')
      .pipe(jade())
      .pipe(gulp.dest(outDir));
  };
}

function styles(outDir) {
  return function() {
    return gulp.src('public/*.css')
      .pipe(gulp.dest(outDir))
      .pipe(connect.reload());
  };
}

function vendor(outDir) {
  return function() {
    return gulp.src('public/vendor/**')
      .pipe(gulp.dest(outDir + '/vendor'));
  };
}

function icons(outDir) {
  return function() {
    return gulp.src('public/icons/**')
      .pipe(gulp.dest(outDir + '/icons'));
  };
}


gulp.task('templates', templates(devBuildDir));
gulp.task('styles', styles(devBuildDir));
gulp.task('vendor', vendor(devBuildDir));
gulp.task('icons', icons(devBuildDir));

function compile(opts) {
  var bundler = watchify(
    browserify('./public/main.js', { debug: true })
      .transform(babel)
      .transform(envify({
        NODE_ENV: 'development'
      }), {global: true})
  );

  function rebundle() {
    return bundler.bundle()
      .on('error', handleError)
      .pipe(source('main.js'))
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
  gulp.watch('public/*.css', ['styles']);
  return compile({watch: true});
});

gulp.task('build', function() {
  templates(buildDir)();
  styles(buildDir)();
  vendor(buildDir)();
  icons(buildDir)();
  file('CNAME', 'circuits.im', { src: true })
    .pipe(gulp.dest(buildDir));
  return browserify('./public/main.js')
    .transform(envify({
      NODE_ENV: 'production'
    }), {global: true})
    .transform(babel.configure({
      optional: [
        'optimisation.react.constantElements',
        'optimisation.react.inlineElements'
      ]
    }))
    .bundle().on('error', handleError)
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(buildDir));
});

gulp.task('default', ['templates', 'vendor', 'styles', 'icons', 'connect', 'watch']);
