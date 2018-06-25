const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require('autoprefixer');

const rules = [{
    test: /(\.jsx|\.js)$/,
    use: {
      loader: "babel-loader",
    },
    exclude: /node_modules/
  },
  {
    test: /\.html$/,
    loader: "html-loader"
  },
  {
    test: /\.ejs$/,
    loader: "ejs-loader"
  },
  {
    test: /\.(png|jpg|gif)$/,
    use: [{
      loader: "url-loader",
      options: {
        limit: 18000,
        name: "[name].[ext]"
      }
    }]
  },
];
const proRule = {
  test: /\.css$/,
  use: ExtractTextPlugin.extract({
    fallback: "style-loader",
    use: [{
        loader: "css-loader",
        options: {
          minimize: true
          // sourceMap: true
        }
      },
      {
        loader: "postcss-loader"
      }
    ]
  })
};
const devRule = {
  test: /\.css$/,
  use: ExtractTextPlugin.extract({
    fallback: "style-loader",
    use: [{
        loader: "css-loader",
        options: {
          minimize: true
        }
      },
      {
        loader: "postcss-loader",
        options: {
          plugins: () => [autoprefixer({
            browsers: ["Last 3 versions"]
          })],
        }
      }
    ]
  })
};

module.exports = function (isDev) {
  isDev ? rules.push(devRule) : rules.push(proRule);
  return {
    rules
  };
};