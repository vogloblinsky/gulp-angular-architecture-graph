var gulp    = require('gulp'),
    clean   = require('gulp-clean'),
    ngGraph = require('./index.js'),

    tmpDir = 'tmp';

gulp.task('clean', function () {
    return gulp.src(tmpDir, {read: false})
        .pipe(clean());
});

gulp.task('default', ['clean'], function() {
    gulp.src(['test/fixtures/ui-router.js'])
        .pipe(ngGraph({
            dest: tmpDir
        }));
});