
const buildConfig = require('./config/build');
const gulp = require('gulp');
const webpack = require('webpack-stream');
const clean = require('gulp-clean');
const watch = require('gulp-watch');
const { series, parallel } = require('gulp');

gulp.task('clean', function () {
    return gulp.src(buildConfig.dest.base, { allowEmpty: true })
        .pipe(clean({ force: true }));
});

gulp.task('scripts', function () {
    return gulp.src(buildConfig.modules)
        .pipe(webpack(require('./config/webpack.config')))
        .pipe(gulp.dest(buildConfig.dest.js));
});

gulp.task('tp-scripts', function () {
    return gulp.src(buildConfig.tpjs)
        .pipe(gulp.dest(buildConfig.dest.tpjs));
});

gulp.task('views', function () {
    return gulp.src(buildConfig.views)
        .pipe(gulp.dest(buildConfig.dest.views));
});

gulp.task('fonts', function () {
    return gulp.src(buildConfig.fonts)
        .pipe(gulp.dest(buildConfig.dest.fonts));
});

function watchTasks(done) {
    watch(buildConfig.views, series('views'));
    done();
}

function logBuildCompletion(done) {
    console.log('========================== BUILD COMPLETE ==========================');
    done();
}

gulp.task('default', series('clean', parallel('views', 'scripts', 'tp-scripts', 'fonts'), logBuildCompletion));

exports.watch = parallel('default', watchTasks);