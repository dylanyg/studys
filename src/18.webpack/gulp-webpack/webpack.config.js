var path = require('path')
pkg = require('./package.json'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextWebpackPlugin = require('extract-text-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    webpack = require("webpack");

module.exports = {
    entry: {
        main: './src/web/index.js'
    },
    output: {
        filename: 'js/[name].js',
        path: path.join(__dirname, '/dist/sjfc'),
        publicPath:'/'
    },
    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: 'html-loader?name=html/[name].html'
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader',
                options: {
                    limit: 225,
                    name: 'images/pc/[name].[ext]',
                    publicPath: 'http://c.58cdn.com.cn/lbg/sjfc/'
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: path.resolve(__dirname, 'node_modules') //编译时，不需要编译哪些文件
            }, {
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            }
        ]
    },
    plugins: [
        new ExtractTextWebpackPlugin({
            filename: 'css/[name].css',
            allChunks: true
        }),
        new CleanWebpackPlugin(
            ['dist/*'],　 //匹配删除的文件
            {
                root: __dirname,       　　　　　　　　　　//根目录
                verbose: true,        　　　　　　　　　　//开启在控制台输出信息
                dry: false        　　　　　　　　　　//启用删除文件
            }
        )
    ]

};