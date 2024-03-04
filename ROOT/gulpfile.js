
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

gulp.task('scripts-prod', function () {
    const config = require('./config/webpack.config');
    config.mode = 'production';

    return gulp.src(buildConfig.modules)
        .pipe(webpack(config))
        .pipe(gulp.dest(buildConfig.dest.js));
});

gulp.task('scripts-watch', function () {
    const config = require('./config/webpack.config');
    config.mode = 'development';
    config.watch = true;
    
    return gulp.src(buildConfig.modules)
        .pipe(webpack(config))
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

gulp.task('default', series('clean', parallel('views', 'scripts-watch', 'tp-scripts', 'fonts'), logBuildCompletion));

exports.watch = parallel('default', watchTasks);
exports.build = parallel(series('clean', parallel('views', 'scripts-prod', 'tp-scripts', 'fonts')));