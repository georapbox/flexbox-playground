var gulp = require('gulp'),
  gutil = require('gulp-util'),
  jshint = require('gulp-jshint'),
  compass = require('gulp-compass'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  gnf = require('gulp-npm-files'),
  input = {
    // 'html': 'src/*.html',
    'sass': 'src/sass/**/*.scss',
    'javascript': 'src/javascript/**/*.js',
    'lib': 'src/lib/**/*'
  },
  output = {
    // 'html': 'dist',
    'stylesheets': 'dist/css',
    'javascript': 'dist/js',
    'lib': 'dist/lib'
  };

/* run javascript through jshint */
gulp.task('jshint', function () {
  return gulp.src(input.javascript).
    pipe(jshint()).
    pipe(jshint.reporter('jshint-stylish'));
});

/* concat javascript files, minify if --type production */
gulp.task('build-js', function () {
  return gulp.src(input.javascript).
    pipe(concat('app.js')).
    // only uglify if gulp is ran with '--type production'
    pipe(gutil.env.type === 'production' ? uglify() : gutil.noop()).
    pipe(gulp.dest(output.javascript));
});

/* compile scss files */
gulp.task('build-css', function () {
  return gulp.src(input.sass).
    pipe(compass({
      css: 'dist/css',
      sass: 'src/sass'
    })).
    pipe(gulp.dest(output.stylesheets));
});

/* copy any html files to dist */
gulp.task('copy-html', function () {
  return gulp.
    src(input.html).
    pipe(gulp.dest(output.html));
});

/* Watch these files for changes and run the task on update */
gulp.task('watch', function () {
  gulp.watch(input.javascript, ['jshint', 'build-js']);
  gulp.watch(input.sass, ['build-css']);
  gulp.watch(input.lib, ['copy-lib']);
  // gulp.watch(input.html, ['copy-html']);
});

// Copy dependencies to dist/node_modules/
gulp.task('copy-npm-dependencies-only', function() {
  gulp.src(gnf(), {base:'./'}).pipe(gulp.dest('./dist'));
});

gulp.task('copy-lib', function() {
  gulp.src(input.lib).pipe(gulp.dest(output.lib));

  gulp
    .src('node_modules/angular-material/angular-material.min.css')
    .pipe(gulp.dest('dist/vendor/angular-material'));

  gulp
    .src('node_modules/angular/angular.min.js')
    .pipe(gulp.dest('dist/vendor/angular'));

  gulp
    .src('node_modules/angular-animate/angular-animate.min.js')
    .pipe(gulp.dest('dist/vendor/angular-animate'));

  gulp
    .src('node_modules/angular-aria/angular-aria.min.js')
    .pipe(gulp.dest('dist/vendor/angular-aria'));

  gulp
    .src('node_modules/angular-material/angular-material.min.js')
    .pipe(gulp.dest('dist/vendor/angular-material'));
});

/* run the watch task when gulp is called without arguments */
gulp.task('build', ['jshint', 'copy-lib', 'build-js', 'build-css']);
