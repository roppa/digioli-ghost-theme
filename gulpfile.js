const gulp = require('gulp');
const livereload = require('gulp-livereload');
const zip = require('gulp-zip');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const sequence = require('run-sequence');
const concatCss = require('gulp-concat-css');

gulp.task('dev', ['css'], () => {
  livereload.listen(1234);
});

gulp.task('zip', ['css'], function () {
  const destination = 'dist/';
  const themeName = require('./package.json').name;
  const filename = themeName + '.zip';

  return gulp.src([
      '**',
      '!node_modules', '!node_modules/**',
      '_css',
      '!dist', '!dist/**'
    ])
    .pipe(zip(filename))
    .pipe(gulp.dest(destination));
});

gulp.task('css', (done) => {
  return sequence('sass', 'minimise-css', done);
});

gulp.task('sass', () => {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./_css'));
});

gulp.task('minimise-css', () => {
  return gulp.src('./_css/*.css')
    .pipe(cleanCSS())
    .pipe(concatCss('css/main.css'))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('./assets'));
});

gulp.task('watch', () => {
  gulp.watch('sass/**', ['css']);
});

gulp.task('default', ['dev'], () => {
  gulp.start('watch');
});
