const path = require("path");
const webpack = require("webpack");

const UglifyJsPlugin = require("webpack/lib/optimize/UglifyJsPlugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const DefinePlugin = require("webpack/lib/DefinePlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devtool: "eval-source-map",
  entry: {
    index: "./index.js",
    techs: './techs.js',
    news: './news.js',
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "[name].js"
  },
  module: require("./config/webpack.module.js")("dev"),
  devServer: {
    port: "2017",
    contentBase: "public", //本地服务器所加载的页面所在的目录
    historyApiFallback: {
      disableDotRule: true,
      rewrites: [
        { from: /^\/Home\/techs\/index\/id\/\d+$/, to: '/techs.html' },
        { from: /^\/Home\/News\/index\/id\/\d+$/, to: '/news.html' },
      ]
    }, //不跳转
    inline: true //实时刷新
  },
  plugins: [
    new ExtractTextPlugin({
      filename: `[name].css` // 给输出的 CSS 文件名称加上 hash 值
    }),
    new HtmlWebpackPlugin({
      template: "./index.html",
      chunks: ["index"],
      filename: "./index.html"
    }),
    new HtmlWebpackPlugin({
      template: "./techs.html",
      chunks: ["techs"],
      filename: "./techs.html"
    }),
    new HtmlWebpackPlugin({
      template: "./news.html",
      chunks: ["news"],
      filename: "./news.html"
    }),
    new DefinePlugin({
      ENV: JSON.stringify("dev")
    })
  ],
  externals: {
    jquery: "window.$"
  }
};