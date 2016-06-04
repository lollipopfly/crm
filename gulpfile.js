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
    changed       = require('gulp-changed'),
    debug         = require('gulp-debug'),
    elixir        = require('laravel-elixir');

/*------------------------------------*\
 TASKS
 \*------------------------------------*/
//require('laravel-elixir-livereload');
//elixir(function(mix) {
//    mix.livereload();
//});

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
            'public/theme/libs/assets/animate.css/animate.css',
            'public/theme/libs/assets/font-awesome/css/font-awesome.min.css',
            'public/theme/libs/assets/simple-line-icons/css/simple-line-icons.css',
            'public/theme/libs/jquery/bootstrap/dist/css/bootstrap.css',
            'public/theme/css/font.css',
            'public/theme/css/app.css',
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
        .pipe(debug({title: 'sass:'}))
        .pipe(gulp.dest('public/build/css/'));
});

/*------------------------------------*\
 Uglify
 \*------------------------------------*/

gulp.task('compress', function() {
    return gulp.src([
        "public/theme/libs/jquery/jquery/dist/jquery.js",
        "public/theme/libs/jquery/bootstrap/dist/js/bootstrap.js",
        "public/theme/js/ui-load.js",
        "public/theme/js/ui-jp.config.js",
        "public/theme/js/ui-jp.js",
        "public/theme/js/ui-nav.js",
        "public/theme/js/ui-toggle.js",
        "public/theme/js/ui-client.js",

        'resources/assets/js/common.js'
        ])
        .pipe(plumber())
        //.pipe(coffee({bare: true}))
        .pipe(concat('global.min.js'))
        //.pipe(uglify())
        .pipe(debug({title: 'compress-js:'}))
        .pipe(gulp.dest('public/build/js/'));
});

gulp.task('coffee', function() {
    gulp.src('./src/*.coffee')
        .pipe(coffee({bare: true}).on('error', gutil.log))
        .pipe(debug({title: 'coffee:'}))
        .pipe(gulp.dest('./public/'));
});

gulp.task('copy-theme-libs', function() {
    return gulp
        .src([
            'public/theme/libs/**/*',
        ])
        .pipe(changed('public/libs'))
        .pipe(debug({title: 'copy-theme-libs:'}))
        .pipe(gulp.dest('public/libs'));
});

gulp.task('copy-theme-fonts', function() {
    return gulp
        .src([
            'public/theme/fonts/**/*',
            'public/theme/libs/assets/font-awesome/fonts/**/*',
            'public/theme/libs/assets/simple-line-icons/fonts/**/*',
        ])
        .pipe(changed('public/build/fonts'))
        .pipe(debug({title: 'copy-theme-fonts:'}))
        .pipe(gulp.dest('public/build/fonts'));
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

gulp.task('default', [
    'sass',

    'copy-theme-libs',
    'copy-theme-fonts',
    'compress',
    'watch'
]);


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

