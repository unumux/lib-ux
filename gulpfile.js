var gulp = require('gulp');
var babel = require('gulp-babel');


gulp.task("build", function() {
    return gulp.src("src/index.js")
        .pipe(babel({
            presets: ["stage-0", "es2015"]
        }))
        .pipe(gulp.dest("dist"));
});

gulp.task("default", ["build"], function() {
    return gulp.watch("src/**", ["build"]);
});
