var gulp          = require('gulp'),
    changed       = require('gulp-changed'),
    slim          = require("gulp-slim"),
    postcss       = require('gulp-postcss'),
    sass          = require('gulp-sass'),
    size          = require('postcss-size'),
    coffee        = require('gulp-coffee'),
    sourcemaps    = require('gulp-sourcemaps'),
    pxtorem       = require('postcss-pxtorem'),
    colorFunction = require("postcss-color-function"),
    postcssExtend = require('postcss-sass-extend'),
    autoprefixer  = require('autoprefixer'),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglify'),
    selectors     = require('postcss-custom-selectors'),
    plumber       = require('gulp-plumber'),
    notify        = require("gulp-notify"),
    debug         = require('gulp-debug'),
    gutil         = require('gulp-util'),
    elixir        = require('laravel-elixir');

/*------------------------------------*\
 Slim
\*------------------------------------*/
gulp.task('slim', function(){
  gulp.src("resources/views/**/*.slim")
    .pipe(changed('public/views/', {extension: '.html'}))
    .pipe(slim({
      pretty: true,
      options: "attr_list_delims={'(' => ')', '[' => ']'}",
    }))
    .on('error', function (message) {
        gutil.log(gutil.colors.red(message));
        this.emit('end');
    })
    .pipe(debug({title: 'render-slim:'}))
    .pipe(gulp.dest("public/views/"));
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
          'public/libs/assets/animate.css/animate.css',
          'public/libs/assets/font-awesome/css/font-awesome.min.css',
          'public/libs/assets/simple-line-icons/css/simple-line-icons.css',
          'public/libs/jquery/bootstrap/dist/css/bootstrap.css',
          // 'node_modules/angular-atomic-notify/dist/angular-atomic-notify.min.css',
          'public/theme/css/font.css',
          'public/theme/css/app.css',
          'resources/assets/sass/app.scss',
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
    'public/libs/jquery/jquery/dist/jquery.js',
    'public/libs/jquery/bootstrap/dist/js/bootstrap.js',

    'public/theme/js/ui-load.js',
    'public/theme/js/ui-jp.config.js',
    'public/theme/js/ui-jp.js',
    'public/theme/js/ui-nav.js',
    'public/theme/js/ui-toggle.js',
    'public/theme/js/ui-client.js',

    'node_modules/angular/angular.js',
    'node_modules/angular-ui-router/release/angular-ui-router.js',
    'node_modules/satellizer/dist/satellizer.js',
    'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
    'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
    'node_modules/easy-pie-chart/dist/angular.easypiechart.js',
    'node_modules/ng-lodash/build/ng-lodash.js',
    'node_modules/ng-mask/dist/ngMask.js',
    'node_modules/angular-notification/angular-notification.js',
    'node_modules/pusher-js/dist/web/pusher.js',
    'node_modules/moment/moment.js',
    'node_modules/angular-moment/angular-moment.js',
    'node_modules/ng-file-upload/dist/ng-file-upload-shim.js',
    'node_modules/ng-file-upload/dist/ng-file-upload.js',
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
      .pipe(plumber())
      .pipe(concat('app.js'))
      .pipe(sourcemaps.write())
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
  gulp.watch('resources/views/**/*.slim', ['slim']);
  gulp.watch('resources/assets/sass/**/*.scss', { interval: 500 }, ['sass', 'notify']);
  gulp.watch('resources/assets/js/**/*.coffee', ['compile-coffee']);
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
  'slim',
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