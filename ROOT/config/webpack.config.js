module.exports = {
    entry: './modules/index.js',
    output: {
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
