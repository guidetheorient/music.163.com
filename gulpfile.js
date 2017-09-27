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
             .pipe(gulp.dest('dist/css'))
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


//html压缩
const htmlmin = require('gulp-htmlmin');//html压缩组件
const removeEmptyLines = require('gulp-remove-empty-lines');//清除空白行
gulp.task('minifyHtml',function(){
  var options = {
      removeComments: true,//清除HTML注释
      collapseWhitespace: false,//压缩HTML
      collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
      removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
      removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
      removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
      minifyJS: true,//压缩页面JS
      minifyCSS: true//压缩页面CSS
  };
  gulp.src('dist/*.html').pipe(clean()); 
  return gulp.src('*.html')
      .pipe(removeEmptyLines({
        removeComments: true,
        /*去掉所有空格
        removeSpaces:true*/
      }))
      .pipe(htmlmin(options))
      .pipe(gulp.dest('dist'));
});

//替换link script地址
const replace = require('gulp-replace');//替换html片段
gulp.task('cssJsPathInHtml',['minifyHtml'],function(){
  return gulp.src('dist/*.html')
        .pipe(replace('./src','./'))
        .pipe(gulp.dest('dist'))
})