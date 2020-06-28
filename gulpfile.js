var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var autoprefixer = require('autoprefixer');
var mainBowerFiles = require('main-bower-files');
var browserSync = require('browser-sync').create();
var minimist = require('minimist');


var envOptions = {
   string: 'env',
   default: { env: 'develop' }
}

var options = minimist(process.argv.slice(2), envOptions)
console.log(options)

gulp.task('clean', function () {
   return gulp.src(['./dist'], { read: false, allowEmpty: true })
      .pipe($.clean());
});

gulp.task('img', function () {
   // var YOUR_LOCALS = {};
   return gulp.src('./src/img/*')
      .pipe($.plumber())
      .pipe(gulp.dest('./dist/img'))
});

gulp.task('html', function () {
   // var YOUR_LOCALS = {};
   return gulp.src('./src/*.html')
      .pipe($.plumber())
      .pipe(gulp.dest('./dist/'))
      .pipe(browserSync.stream());
});

gulp.task('json', function () {
   // var YOUR_LOCALS = {};
   return gulp.src('./src/*.json')
      .pipe($.plumber())
      .pipe(gulp.dest('./dist/'))
});

gulp.task('sass', function () {

   return gulp.src('./src/scss/**/*.scss')
      .pipe($.plumber())
      .pipe($.sourcemaps.init())
      .pipe($.sass().on('error', $.sass.logError))
      // 編譯完成
      .pipe($.postcss([autoprefixer()]))
      .pipe($.if(options.env === 'production', $.minifyCss()))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest('./dist/css'))
      .pipe(browserSync.stream());
});

gulp.task('babel', () =>
   gulp.src('./src/js/**/*.js')
      .pipe($.plumber())
      .pipe($.sourcemaps.init())
      .pipe($.babel({
         presets: ['@babel/preset-env']
      }))
      .pipe($.concat('all.js'))
      .pipe($.if(options.env === 'production', $.uglify()))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest('./dist/js'))
      .pipe(browserSync.stream())
);

gulp.task('image-min', function () {
   return gulp.src('src/img/*')
      .pipe($.if(options.env === 'production', $.imagemin()))
      .pipe(gulp.dest('dist/img'))
});

gulp.task('deploy', function () {
   return gulp.src('./dist/**/*')
      .pipe($.ghPages());
});

gulp.task('build',
   gulp.series(
      'clean',
      'img',
      'json',
      gulp.parallel('html', 'sass', 'babel', 'image-min')
   )
);

gulp.task('default',
   gulp.series(
      'img',
      'json',
      gulp.parallel('html', 'sass', 'babel'),
      function (done) {
         browserSync.init({
            server: {
               baseDir: "./dist"
            }
         });

         gulp.watch('./src/scss/**/*.scss', gulp.series('sass'));
         gulp.watch('./src/*.html', gulp.series('html'));
         gulp.watch('./src/js/**/*.js', gulp.series('babel'));
         done();
      }
   )
);