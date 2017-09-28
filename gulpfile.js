const gulp = require('gulp')
const csso = require('gulp-csso');
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');//文件夹清空
const uglify = require('gulp-uglify');
const babel = require("gulp-babel");


//html:压缩
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

//html:替换中link script地址
const replace = require('gulp-replace');//替换html片段
gulp.task('cssJsPathInHtml',['minifyHtml'],function(){
  return gulp.src('dist/*.html')
        .pipe(replace('./src/','./'))
        .pipe(gulp.dest('dist'))
})

//css：压缩，生成版本号
gulp.task('dist:css',function () {
  gulp.src('dist/css/*').pipe(clean());
  return gulp.src('src/css/*.css')
             .pipe(csso())
             .pipe(autoprefixer({
                  browsers:['last 2 versions'],
                  cascade:false
             }))
             .pipe(rev())
             .pipe(gulp.dest('dist/css'))
             .pipe(rev.manifest())
             .pipe(gulp.dest('dist/rev/css'))
})

//js：压缩，生成版本号
gulp.task('dist:js',function () {
  gulp.src('dist/js/*').pipe(clean());
  return gulp.src('src/js/*.js')
             .pipe(babel())
             .pipe(uglify())
             .pipe(rev())
             .pipe(gulp.dest('dist/js'))
             .pipe(rev.manifest())
             .pipe(gulp.dest('dist/rev/js'))
})

const rev = require('gulp-rev');//对文件名加MD5后缀
const revCollector = require('gulp-rev-collector');//路径替换
//html，针对js,css,img
gulp.task('rev',['dist:css',"dist:js","cssJsPathInHtml"], function() {
  return gulp.src(['dist/rev/**/*.json', 'dist/*.html'])
      .pipe(revCollector({replaceReved:true }))
      .pipe(gulp.dest('dist'));
})

gulp.task('default',['rev'])

//监听css，js修改
gulp.task('watch',function () {
  gulp.watch('src/**/*',['rev'])
})

//js: 语法检查
const jshint = require('gulp-jshint');//js语法检查
const pkg = require('./package'); //导入package.json
const jshintConfig = pkg.jshintConfig;//使用package.json中的配置项，或者单独使用.jshintrc文件
//不要找.jshintrc文件了
jshintConfig.lookup = false;

gulp.task('jshint', function () {
  gulp.src('src/js/*.js')
      .pipe(jshint(jshintConfig))
      .pipe(jshint.reporter('default'));
});


