var gulp          = require('gulp'),
    postcss       = require('gulp-postcss'),
    sass          = require('gulp-sass'),
    size          = require('postcss-size'),
    coffee        = require('gulp-coffee'),
    sourcemaps    = require('gulp-sourcemaps')
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
    gutil         = require('gulp-util'),
    elixir        = require('laravel-elixir');

/*------------------------------------*\
 TASKS
 \*------------------------------------*/
// require('laravel-elixir-livereload');
// elixir(function(mix) {
//    mix.livereload();
// });

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
        'public/theme/libs/jquery/jquery/dist/jquery.js',
        'public/theme/libs/jquery/bootstrap/dist/js/bootstrap.js',
        'public/theme/js/ui-load.js',
        'public/theme/js/ui-jp.config.js',
        'public/theme/js/ui-jp.js',
        'public/theme/js/ui-nav.js',
        'public/theme/js/ui-toggle.js',
        'public/theme/js/ui-client.js',

        'node_modules/angular-route/angular-route.js',
        'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
        'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
        'node_modules/ng-lodash/build/ng-lodash.js',
        "node_modules/ng-mask/dist/ngMask.js",
        "node_modules/moment/moment.js",
        "node_modules/angular-moment/angular-moment.js"
    ])
        .pipe(plumber())
        .pipe(concat('global.min.js'))
        //.pipe(uglify())
        .pipe(debug({title: 'compress-js:'}))
        .pipe(gulp.dest('public/build/js/'));
});

gulp.task('compile-coffee', function() {
    gulp.src('resources/assets/js/**/*.coffee')
        .pipe(sourcemaps.init())
        .pipe(coffee({bare: true}).on('error', gutil.log))
        .pipe(sourcemaps.write())
        .pipe(plumber())
        .pipe(concat('app.js'))
        .pipe(debug({title: 'compile-coffee:'}))
        .pipe(gulp.dest('public/build/js'));
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
    gulp.watch('resources/assets/js/**/*.coffee', ['compile-coffee', 'notify']);
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
    'copy-theme-libs',
    'copy-theme-fonts',
    'sass',
    'compress',
    'compile-coffee',
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

