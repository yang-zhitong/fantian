const path = require("path");
const webpack = require("webpack");

const UglifyJsPlugin = require("webpack/lib/optimize/UglifyJsPlugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const DefinePlugin = require("webpack/lib/DefinePlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
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
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css'
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
    // new UglifyJsPlugin(),
  ],
  externals: {
    jquery: "window.$"
  }
};