const gulp = require('gulp');
const $ = require('gulp-load-plugins')({ pattern: '*' });
const path = require('path');
const rr = require('rimraf');

gulp.task('build-clean', function () {
    return new Promise((resolve) => {
        rr(path.join(__dirname, 'demo'), () => { resolve() });
    })
});
///AMBIENTES
//DEV
gulp.task('build-js-dev', () => {
    return gulp.src('src/js/**/*.js')
        .pipe($.babel({ presets: ['es2015', 'stage-2'] }))
        .pipe(gulp.dest('demo/js'));
});
gulp.task('build-sass-dev', () => {
    return gulp.src('src/sass/**/*.scss')
        .pipe($.sass.sync().on('error', $.sass.logError))
        .pipe(gulp.dest('demo/css'));
});
gulp.task('build-html-dev', function () {
    var target = gulp.src('src/index.template.html');
    var sources = gulp.src([
        'demo/js/**/*.js',
        '!demo/js/**/*.min.js',
        'demo/css/**/*.css'
    ], { read: false });
    return target
        .pipe($.inject(sources))
        .pipe($.rename('index.html'))
        .pipe(gulp.dest('demo'));
});
gulp.task('sequence:dev', (callback) => {
    $.runSequence('build-clean',
        ['build-js-dev', 'build-sass-dev'],
        'build-html-dev',
        callback
    );
});
gulp.task('go:dev', ['sequence:dev'], function () {
    gulp.watch('src/sass/**/*.scss', ['build-sass-dev']);
    gulp.watch('src/js/**/*.js', ['build-js-dev']);
});
////////////////////////
//PROD
gulp.task('build-js-prod', () => {
    return gulp.src('src/js/**/*.js')
        .pipe($.sourcemaps.init())
        .pipe($.babel({ presets: ['es2015', 'stage-2'] }))
        .pipe($.concat('bundle.min.js'))
        .pipe($.uglify())
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('demo/js'));
});
gulp.task('build-sass-prod', () => {
    return gulp.src('src/sass/**/*.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass.sync({ outputStyle: 'compressed' }).on('error', $.sass.logError))
        .pipe($.cleanCss())
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('demo/css'));
});
gulp.task('build-html-prod', function () {
    var target = gulp.src('src/index.template.html');
    var sources = gulp.src([
        'demo/js/**/*.min.js',
        'demo/css/**/*.css'
    ], { read: false });
    return target
        .pipe($.inject(sources))
        .pipe($.rename('index.html'))
        .pipe(gulp.dest('demo'));
});
gulp.task('go:prod', (callback) => {
    $.runSequence('build-clean',
        ['build-js-prod', 'build-sass-prod'],
        'build-html-prod',
        callback
    );
});
////////////////////////








//gulp.task('default', ['build-js', 'build-sass', 'build-html']);

// gulp.task('gg', ['default'], function () {
//     gulp.watch('src/**/*.scss', ['sass']);
//     gulp.watch('src/**/*.js', ['js']);
// });



/*


        // .pipe($.minify({
        //     ext: {
        //         src: '-min.js',
        //         min: [/\.(.*)-source\.js$/, '$1.js']
        //     },
        //     ignoreFiles: ['.min.js']
        // }))



*/