const gulp = require('gulp')
const csso = require('gulp-csso');
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');//文件夹清空
const uglify = require('gulp-uglify');
const babel = require("gulp-babel");

gulp.task('dist:css',function () {
  gulp.src('dist/css/*').pipe(clean());
  return gulp.src('src/css/*.css')
             .pipe(csso())
             .pipe(autoprefixer({
                  browsers:['last 2 versions'],
                  cascade:false
             }))
             .pipe(gulp.dest('dist/css/'))
})

gulp.task('dist:js',function () {
  gulp.src('dist/js/*').pipe(clean());
  return gulp.src('src/js/*.js')
             .pipe(babel())
             .pipe(uglify())
             .pipe(gulp.dest('dist/js'))
})


gulp.task('rev',['dist:css','dist:js'],function () {
  return gulp.src(['dist/css/*.css','dist/js/*.js'])
             .pipe(rev())
             .pipe(gulp.dest('dist/css'))
             .pipe(rev.manifest())
             .pipe(gulp.dest('rev'))
})


gulp.task('default',['dist:css','dist:js'])

gulp.task('watch',function () {
  gulp.watch('src/**/*.css',['dist:css'])
  gulp.watch('src/**/*.js',['dist:js'])
})