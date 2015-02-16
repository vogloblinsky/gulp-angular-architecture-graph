## TODOS

# Inputs

- array of sources files, and excludes if needed
- output folder
- options ?

# Task example

var ngGraph = require('gulp-angular-architecture-graph');

gulp.task('ng-graph', function(){
    gulp.src(['file.txt'])
        .pipe(ngGraph({
            toto: 'optionA'
        }))
        .pipe(gulp.dest('architecture'));
});


# Exclude folders

'!**/external/**'