const path = require('path');

module.exports = {
    mode: 'development',
    watch: true,
    entry: './modules/index.js', // Adjust entry path if necessary
    output: {
        // path: path.resolve(__dirname, '..', 'dist'), // Adjust output path if necessary
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }, {
                test: /\.scss$/,
                use: [
                    'style-loader', // Inject CSS into the DOM
                    'css-loader',   // Translate CSS into CommonJS
                    'sass-loader'   // Compile Sass to CSS
                ]
            }
        ]
    }
};
