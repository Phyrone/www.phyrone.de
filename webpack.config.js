const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MarkdownPlugin = require('markdown-html-webpack-plugin');
const LinkTypePlugin = require('html-webpack-link-type-plugin').HtmlWebpackLinkTypePlugin;
const marked = require("marked");
const fs = require("fs")
const markdownRenderer = new marked.Renderer();
const devMode = process.env.NODE_ENV !== 'production';

function loadMdContent(name) {
    return String(fs.readFileSync("src/" + name + ".html"))
        .replace('{{markdownContent}}',
            marked(String(fs.readFileSync("src/" + name + ".md"))))
}

const config = {
    entry: {
        main: './src/script/index.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'resources/script/[name].[contenthash].js',
        assetModuleFilename: 'resources/assets/[contenthash][ext][query]'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.ts(x)?$/,
                //loader: 'ts-loader',
                use: [
                    'babel-loader',
                    'ts-loader'
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ],
            },
            {

                test: /\.json/,
                type: 'asset/resource'

            },
            {

                test: /\.(png|svg|jpg|jpeg|gif)/,
                type: 'asset/resource'

            },
            {

                test: /\.(woff|woff2|eot|ttf|otf)$/i,

                type: 'asset/resource',

            },
        ]
    },
    devServer: {
        contentBase: './dist',
    },
    plugins: [
        /*new CopyPlugin({
            patterns: [{
                from: 'src/script/particlesjs-config.json',
                to: 'resources/[contenthash].json'
            },],
        }),*/
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html',
            scriptLoading: 'defer',
            inject: 'head',
            minify: false,
            cache: false,
            hash: true,
        }),
        new HtmlWebpackPlugin({
            filename: 'impressum/index.html',
            //template: 'src/index.html',
            scriptLoading: 'defer',
            inject: 'head',
            minify: false,
            cache: false,
            hash: true,
            templateContent: loadMdContent("impressum")
        }),
        new HtmlWebpackPlugin({
            filename: 'privacy/index.html',
            //template: 'src/index.html',
            scriptLoading: 'defer',
            inject: 'head',
            minify: false,
            cache: false,
            hash: true,
            templateContent: loadMdContent("privacy")
        }),
        new LodashModuleReplacementPlugin,
        new MiniCssExtractPlugin({
            chunkFilename: 'resources/css/' + ('[id].[contenthash].css'),
            filename: 'resources/css/' + ('[name].[contenthash].css'),
            //minify: true
        }),
        new CleanWebpackPlugin(),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
        }),
        new LinkTypePlugin(),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    ],
    resolve: {
        extensions: [
            '.tsx',
            '.ts',
            '.js'
        ],
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    }
};
if (devMode) {
    // only enable hot in development
    //config.plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = (env, argv) => {
    if (argv.hot) {
        // Cannot use 'contenthash' when hot reloading is enabled.
        config.output.filename = '[name].[hash].js';
    }
    return config;
};