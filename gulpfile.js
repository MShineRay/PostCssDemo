//var browserify = require('browserify');
var gulp = require('gulp');
var del = require('del');//删除文件
var gulpChanged = require('gulp-changed');//仅仅传递更改过的文件
var gulpFileInclude = require('gulp-file-include');//合并html;HTML 代码复用
var gulpSequence = require('gulp-sequence');// gulp顺序执行任务
var gulpUglify = require('gulp-uglify');//压缩js文件
var gulpCleanCss = require('gulp-clean-css');//压缩css文件
//var gulpWatch = require('gulp-watch');
//var gulpMinifyCss = require('gulp-minify-css');//压缩css文件
//var gulpBabel = require('gulp-babel');
//var gulpLess = require('gulp-less');
//var gulpNotify = require('gulp-notify');
//var gulpPlumber = require('gulp-plumber');
//var gulpConcat = require('gulp-concat');
//var gulpRevAppend = require('gulp-rev-append');
//var vinylBuffer = require('vinyl-buffer');
//var vinylSourceStream = require('vinyl-source-stream');
var postcss = require('gulp-postcss');
var px2rem = require('postcss-px2rem');

var Ver = new Date().getTime();
var outDir = './dest'; //默认：输出目录
var FLAG_MIN_JS = true;//开关：是否压缩JS
var FLAG_MIN_CSS = true;//开关：是否压缩CSS
var files = {
  css: {
    'src': ['./src/assets/css/**/*.css'],
    'dest': outDir + '/css'
  },
  images: {
    'src': ['./src/assets/images/**/*'],
    'dest': outDir + '/images'
  },
  libs: {
    'src': ['./src/assets/lib/**/*'],
    'dest': outDir + '/lib'
  },
  commonJS: {
    'src': ['./src/assets/js/common/**/*.js'],
    'dest': outDir + '/js/common'
  },
  js: {
    'src': ['./src/assets/js/**/*.js'],
    'dest': outDir + '/js'
  },
  html: {
    'src': ['./src/html/**/*'],
    'dest': outDir + '/'
  }
};


/**
 * 清理css
 */
gulp.task('clean_css', function (cb) {
  return del(files.css.dest, cb);
});

/**
 * 拷贝css
 */
gulp.task('copy_css', ['clean_css'], function () {
  if (FLAG_MIN_CSS) {
    return gulp.src(files.css.src)
      .pipe(gulpCleanCss())
      .pipe(gulp.dest(files.css.dest));
  } else {
    return gulp.src(files.css.src)
      .pipe(gulp.dest(files.css.dest));
  }
});


gulp.task('out_css_px2rem', ['clean_css'], function () {
  var processors = [px2rem({remUnit: 75})];
  if (FLAG_MIN_CSS) {
    return gulp.src(files.css.src)
      .pipe(postcss(processors))
      .pipe(gulpCleanCss())
      .pipe(gulp.dest(files.css.dest));
  } else {
    return gulp.src(files.css.src)
      .pipe(postcss(processors))
      .pipe(gulp.dest(files.css.dest));
  }
});

gulp.task('clean_lib', function (cb) {
  return del(files.libs.dest, cb);
});

gulp.task('copy_libs', ['clean_lib'], function () {
  return gulp.src(files.libs.src)
    .pipe(gulp.dest(files.libs.dest));
});

/**
 * 清理图片
 */
gulp.task('clean_images', function (cb) {
  return del(files.images.dest, cb);
});

/**
 * 拷贝图片
 */
gulp.task('copy_images', ['clean_images'], function () {
  return gulp.src(files.images.src)
    .pipe(gulp.dest(files.images.dest));
});

gulp.task('clean_js', function (cb) {
  return del(files.js.dest, cb);
});

gulp.task('copy_js', ['clean_js'], function () {
  if (FLAG_MIN_JS) {
    return gulp.src(files.js.src)
      .pipe(gulpChanged(files.js.dest))
      .pipe(gulpUglify())
      .pipe(gulp.dest(files.js.dest));
  } else {
    return gulp.src(files.js.src)
      .pipe(gulpChanged(files.js.dest))
      .pipe(gulp.dest(files.js.dest));
  }
});

// gulp.task('clean_html', function (cb) {
//   return del(files.html.dest, cb);
// });

gulp.task('copy_html', function () {
  return gulp.src(files.html.src)
    .pipe(gulp.dest(files.html.dest));
});

// gulp.task('concat_html_business', function () {
//   return gulp.src(files.business_html.src)
//     .pipe(gulpFileInclude({
//       prefix: '@@',
//       basepath: '@file',
//       context: {
//         Title: "---",
//         CdnPrefix: ".",
//         BodyCss: "",
//         Text: "",
//         Link: "",
//         Ver: Ver
//       }
//     }))
//     .pipe(gulp.dest(files.business_html.dest));
// });

gulp.task('watch', function () {
  gulp.watch(files.css.src, ['out_css_px2rem']);
  gulp.watch(files.libs.src, ['copy_libs']);
  gulp.watch(files.images.src, ['copy_images']);
  gulp.watch(files.js.src, ['copy_js']);
  gulp.watch(files.html.src, ['copy_html']);
});

gulp.task('default',
  gulpSequence(
    ['out_css_px2rem', 'copy_libs', 'copy_images', 'copy_js', 'copy_html'],
    'watch'
  )
);
