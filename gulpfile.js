var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    artoo = require('gulp-artoo');

gulp.task('default', function() {
    return gulp.src('./src/*.js')
        .pipe(uglify())
        .pipe(artoo({
            loadingText: false,
            settings: {
                log: { enabled: false, welcome: false }
            }
        }))
        .pipe(gulp.dest('./dist'));
});
