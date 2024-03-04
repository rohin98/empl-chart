const baseDIR = './../dist/';

module.exports = {
    dest: {
        base: baseDIR,
        js: baseDIR + 'js',
        tpjs: baseDIR + 'tpjs',
        fonts: baseDIR + 'fonts',
        views: baseDIR,
    },
    modules: './modules/index.js',
    tpjs: './tpjs/**/*.js',
    fonts: './fonts/**/*.woff',
    views: './html/**/*.html'
};