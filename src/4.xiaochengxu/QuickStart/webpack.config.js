var path = require('path')
pkg = require('./package.json'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextWebpackPlugin = require('extract-text-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    webpack = require("webpack");

// PC端排行榜
const PCPHB = new HtmlWebpackPlugin({
    template: 'src/sjfc/html/pc_paihangbang_fen.html', // 源模板文件
    filename: 'html/pc_paihangbang_fen.html', // 输出文件【注意：这里的根路径是module.exports.output.path】
    showErrors: true,
    inject: 'body',
    chunks: ['pc_paihangbang_fen']
})
// 移动端排行榜
const YDPHB = new HtmlWebpackPlugin({
    template: 'src/sjfc/html/m_paihangbang_fen.html', // 源模板文件
    filename: 'html/m_paihangbang_fen.html', // 输出文件【注意：这里的根路径是module.exports.output.path】
    showErrors: true,
    inject: 'body',
    chunks: ['m_paihangbang_fen']
})

module.exports = {
    entry: {
        // pc_paihangbang_fen: './src/sjfc/js/pc_paihangbang_fen.js'
    },
    output: {
        filename: 'js/[name].js',
        path: path.join(__dirname, '/dist'),
        publicPath:'/'
    },
    module: {
        loaders: [
            
        ]
    },
    plugins: [
        // 非必须构建步骤：md5||覆盖静态文件
        new CopyPlugin({
            source: 'src/nodejs/*', // 源模板文件
            target: 'dist/page', // 输出文件【注意：这里的根路径是module.exports.output.path】
        }),
        new CopyPlugin({
            source: 'src/static/*', // 源模板文件
            target: 'dist/static', // 输出文件【注意：这里的根路径是module.exports.output.path】
        })
    ]

};