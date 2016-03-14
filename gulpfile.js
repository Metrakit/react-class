var gulp           = require('gulp'),
    browserify     = require('browserify'),
    babelify       = require('babelify'),
    source         = require('vinyl-source-stream'),
    cssnano        = require('gulp-cssnano'),
    sourcemaps     = require('gulp-sourcemaps'),
    gulpif         = require('gulp-if'),
    argv           = require('yargs').argv,
    uncss          = require('gulp-uncss'),
    browserSync    = require('browser-sync'), 
    sass           = require('gulp-sass'),
    plumber        = require('gulp-plumber'),
    uglify         = require('gulp-uglify')
    path           = require('path'),
    notify         = require('gulp-notify'),
    concat         = require('gulp-concat');

var reload = browserSync.reload;

// paths
var path = {
        src: "src/",
        dist: "dist/",
        bower: 'node_modules/bower_components',
        icons: path.join(__dirname, "node_modules/gulp-notify/node_modules/node-notifier/node_modules/growly/example/")
};

var url = "http://react.dev";

// Error Handler - SCSS
var plumberErrorHandler = { errorHandler: notify.onError({
        title: "SCSS ERROR",
        message: "Error: <%= error.message %>",
        icon: path.icons + "muffin.png",
    })
};

// Scripts task
gulp.task('scripts', function () {
  return browserify({
    entries: path.src + 'js/app.js', 
    debug: true
  })
  .transform("babelify", {presets: ["es2015", "react"]})
  .bundle()
  .on('error', function(err) { console.error(err); this.emit('end'); })
  .pipe(source('bundle.js'))
  .pipe(gulpif(argv.production, uglify()))
  .pipe(gulp.dest(path.dist + 'js/'));
});

// SCSS task
gulp.task('scss', function() {
  gulp.src(path.src + 'scss/*.scss')
    .pipe(plumber(plumberErrorHandler))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(gulpif(argv.production, cssnano()))
    .pipe(sourcemaps.write())
    .pipe(concat('app.css'))
    .pipe(gulpif(argv.production, uncss({
      html: [url]
    })))
    .pipe(gulp.dest(path.dist + 'css'))
    .pipe(reload({ stream: true }));
});

// Browser-sync
gulp.task('browser-sync', function() {
    browserSync({
        proxy: url
    });
});

// Watch task
gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['scripts', browserSync.reload]);
  gulp.watch('src/**/.scss', ['scss']);
  gulp.watch('dist/**/*.html', browserSync.reload);
});

// Default task
gulp.task('default', ['scripts', 'scss']);