/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const isLocal = slsw.lib.webpack.isLocal;

module.exports = {
    mode: isLocal ? 'development' : 'production',
    entry: slsw.lib.entries,
    externals: [nodeExternals()],
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
    },
    output: {
        libraryTarget: 'commonjs',
        path: path.join(__dirname, '.webpack'),
        filename: '[name].js'
    },
    target: 'node',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        plugins: [new TsconfigPathsPlugin()],
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [new ForkTsCheckerWebpackPlugin()]
};