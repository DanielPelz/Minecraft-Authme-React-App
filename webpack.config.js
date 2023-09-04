const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
    mode: 'development',
    entry: {
        dashboard: './assets/js/dashboard.jsx',
        register: './assets/js/register.jsx',
        login: './assets/js/login.jsx',
        homepage: './assets/js/homepage.jsx',
    },

    output: {
        path: path.resolve(__dirname, 'public/dist/'),
        filename: 'js/[name].js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                /* use: [MiniCssExtractPlugin.loader, 'style-loader', 'css-loader', 'postcss-loader'] */
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']

            },
            {
                test: /\.(woff|woff2)$/,
                use: {
                    loader: 'url-loader',
                },
            },
        ]
    },
    plugins: [new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: '[id].css'
    })],
    resolve: {
        extensions: ['.js', '.jsx']
    }
};
