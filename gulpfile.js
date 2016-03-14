var gulp       = require('gulp'),
    browserify = require('browserify'),
    babelify   = require('babelify'),
    source     = require('vinyl-source-stream');

var src_path  = "src/";
var dist_path = "dist/";

gulp.task('scripts', function () {
    return browserify({
        entries: src_path + 'js/app.jsx', 
        extensions: ['.jsx'], 
        debug: true
    })
    .transform('babelify', {presets: ['es2015', 'react']})
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(dist_path + 'js/'));
});

// todo
gulp.task('scss', function() {
    // gulp.src(src_path + 'scss/*.scss')
    // .pipe(plumber(plumberErrorHandler))
    // .pipe(sourcemaps.init())
    // .pipe(sass({
    //  includePaths: bourbon.includePaths
    // }))
    // .pipe(sourcemaps.write())
    // .pipe(concat('app.css'))
    // .pipe(gulpif(argv.production, uncss({
    //     html: [url]
    // })))
    // .pipe(gulp.dest(dist_path + 'css'))
    // .pipe(reload({stream: true}));
});

gulp.task('watch', function () {
    gulp.watch('*.jsx', ['scripts']);
    gulp.watch('*.scss', ['scss']);
});

gulp.task('default', ['scripts', 'scss']);