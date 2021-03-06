/* eslint dot-location: [2, "property"] */
const del = require('del');

const gulp = require('gulp');
const babel = require('gulp-babel');
const header = require('gulp-header');
const rename = require('gulp-rename');
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');



var pkg = require('./package.json');
pkg.buildDate = Date();

var src = 'draft-treeview.js';

var headerLong = [
  '/*',
  '* <%= pkg.name %> - <%= pkg.description %>',
  '* version v<%= pkg.version %>',
  '* <%= pkg.homepage %>',
  '*',
  '* copyright <%= pkg.author %>',
  '* license <%= pkg.license %>',
  '*',
  '* BUILT: <%= pkg.buildDate %>',
  '*/\n'
].join('\n');

var headerShort = [
  '/*<%= pkg.name %> v<%= pkg.version %>',
  '<%= pkg.homepage %>',
  '<%= pkg.license %> license*/\n'
].join(' | ');



gulp.task('clean', function() {
  return del(['dist/*']);
});

gulp.task('es6', ['clean'], function() {
  return gulp.src(src)
    .pipe(rename({suffix: '-es6'}))
    .pipe(header(headerLong, {pkg: pkg}))
    .pipe(size({showFiles: true, title: 'Full'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['clean'], function() {
  return gulp.src(src)
    .pipe(babel({
      plugins: ['transform-remove-console'],
      presets: ['es2015']
    }))
    .pipe(header(headerLong, {pkg: pkg}))
    .pipe(size({showFiles: true, title: 'Full'}))
    .pipe(gulp.dest('dist'))
    .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(header(headerShort, {pkg: pkg}))
      .pipe(size({showFiles: true, title: 'Minified'}))
      .pipe(size({showFiles: true, gzip: true, title: 'Gzipped'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean', 'es6', 'build'], function() {});
