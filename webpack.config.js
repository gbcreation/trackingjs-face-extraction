const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')

module.exports = {
    mode: "development",
    devtool: 'inline-source-map',
    entry: [
        "./src/index.js"
    ],
    plugins: [
        new CopyWebpackPlugin(['src/index.css']),
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new HtmlWebpackIncludeAssetsPlugin({
            assets: ['index.css'],
            append: false
        })
    ]
}
