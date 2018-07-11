'use strict';

const gulp = require('gulp'),                     //основной плагин gulp
  watch = require('gulp-watch'),                  //расширение возможностей watch
  prefixer = require('gulp-autoprefixer'),        //расставление автопрефиксов
  uglify = require('gulp-uglify'),                //минификация js
  less = require('gulp-less'),                    //препроцессор less
  rename = require('gulp-rename'),                //переименовывание файлов
  sourcemaps = require('gulp-sourcemaps'),        //
  rigger = require('gulp-rigger'),                //работа с include в html и js
  cleancss = require('gulp-clean-css'),           //минификация css
  gcmq = require('gulp-group-css-media-queries'), //группирование медиа запросов
  imagemin = require('gulp-imagemin'),            //минификация изображений
  pngquant = require('gulp-pngquant'),            //дополнение к минификации изображений
  rimraf = require('rimraf'),                     //очистка директории
  browserSync = require("browser-sync"),          //атоматическая перезагрузка
  reload = browserSync.reload;

var path = {
  dest: {
    html: 'build/',
    js: 'build/assets/js/',
    css: 'build/assets/styles/',
    img: 'build/assets/images/',
    fonts: 'build/assets/fonts/'
  },
  src: {
    html: 'src/index.html',
    js: 'src/assets/js/main.js',
    style: 'src/assets/styles/main.less',
    img: 'src/assets/images/**/*.*',
    fonts: 'src/assets/fonts/**/*.*'
  },
  watch: {
    html: 'src/**/*.html',
    js: 'src/assets/js/**/*.js',
    style: 'src/assets/styles/**/*.less',
    img: 'src/assets/images/**/*.*',
    fonts: 'src/assets/fonts/**/*.*'
  },
  clean: './build'
};

var config = {
  server: {
    baseDir: "./build"
  },
  tunnel: true,
  host: 'localhost',
  port: 8000,
  logPrefix: "FrontEnd",
  open: true,
  notify: false
};

gulp.task('webserver', function () {
  browserSync(config);
});

gulp.task('clean', function (cb) {
  rimraf(path.clean, cb);
});

gulp.task('html:build', function () {
  gulp.src(path.src.html)
    .pipe(rigger())
    .pipe(gulp.dest(path.dest.html))
    .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
  gulp.src(path.src.js)
    .pipe(sourcemaps.init())
    .pipe(rigger())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.dest.js))
    .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
  gulp.src(path.src.style)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(gcmq())
    .pipe(prefixer({
      browsers: ['> 0.1%'],
      cascade: false
    }))
    .pipe(cleancss({
      level: 2
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest(path.dest.css))
    .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
  gulp.src(path.src.img)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(path.dest.img))
    .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.dest.fonts))
});

gulp.task('build', [
  'html:build',
  'js:build',
  'style:build',
  'fonts:build',
  'image:build'
]);

gulp.task('watch', function(){
  watch([path.watch.html], function(event, cb) {
    gulp.start('html:build');
  });
  watch([path.watch.style], function(event, cb) {
    gulp.start('style:build');
  });
  watch([path.watch.js], function(event, cb) {
    gulp.start('js:build');
  });
  watch([path.watch.img], function(event, cb) {
    gulp.start('image:build');
  });
  watch([path.watch.fonts], function(event, cb) {
    gulp.start('fonts:build');
  });
});

gulp.task('default', ['build', 'webserver', 'watch']);