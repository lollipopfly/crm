var gulp          = require('gulp'),
    postcss       = require('gulp-postcss'),
    sass          = require('gulp-sass'),
    size          = require('postcss-size'),
    coffee        = require('gulp-coffee'),
    pxtorem       = require('postcss-pxtorem'),
    colorFunction = require("postcss-color-function"),
    postcssExtend = require('postcss-sass-extend'),
    autoprefixer  = require('autoprefixer'),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglify'),
    selectors     = require('postcss-custom-selectors'),
    plumber       = require('gulp-plumber'),
    notify        = require("gulp-notify"),
    elixir        = require('laravel-elixir');


/*------------------------------------*\
 TASKS
 \*------------------------------------*/
require('laravel-elixir-livereload');
elixir(function(mix) {
    mix.livereload();
});

/*------------------------------------*\
 Sass
 \*------------------------------------*/

gulp.task('sass', function() {
    var processors = [
        autoprefixer({ browsers: ['last 20 versions'] }),
        selectors,
        postcssExtend,
        size,
        colorFunction,
        //pxtorem({
        //    replace: true
        //})
    ];

    return gulp.src([
            'resources/assets/sass/app.scss'
        ])
        .pipe(concat('style.css'))
        .pipe(sass().on('error', error))
        .pipe(sass(
			{
                //outputStyle: 'compressed'
			}
        ))
        .pipe(postcss(processors))
        .pipe(gulp.dest('public/build/css/'));
});

/*------------------------------------*\
 Uglify
 \*------------------------------------*/

gulp.task('compress', function() {
    return gulp.src([
            'resources/assets/js/common.js'
        ])
        .pipe(plumber())
        .pipe(coffee({bare: true}))
        .pipe(concat('global.min.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('public/build/js/'));
});

gulp.task('coffee', function() {
    gulp.src('./src/*.coffee')
        .pipe(coffee({bare: true}).on('error', gutil.log))
        .pipe(gulp.dest('./public/'));
});

/*------------------------------------*\
 Watch
 \*------------------------------------*/

gulp.task('watch', function() {
    gulp.watch('resources/assets/sass/**/*.scss', { interval: 500 }, ['sass', 'notify']);
    gulp.watch('resources/assets/js/common.js', { interval: 500 }, ['compress', 'notify']);
    // gulp.watch('public/images/main/*.png', { interval: 500 }, ['sprite']);
});

/*------------------------------------*\
 Notify
 \*------------------------------------*/

gulp.task('notify', function(a) {
    var date = new Date();
    gulp.src("public/build/css/style.css")
        .pipe(notify("Css was compiled! at " + date));
});

/*------------------------------------*\
 Run default gulp tasks
 \*------------------------------------*/

gulp.task('default', ['sass', 'compress', 'watch']);


/**
 ***************************************************************
 * =FUNCTIONS
 ***************************************************************
 **/

// function like a plumber js
function error(error) {
    console.log(error.toString());
    this.emit('end');
}

