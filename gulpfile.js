var gulp = require('gulp');
var babel = require('gulp-babel');
var plumber = require('gulp-plumber');

// babel
gulp.task('babel', function () {
  gulp.src('./es6/*.js')
  .pipe(plumber())
  .pipe(babel())
  .pipe(gulp.dest('./js'));
});

gulp.task('watch', function(){
  gulp.watch('./es6/*.js', ['babel']);
});