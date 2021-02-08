var HtmlWebPackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: ['./src/js/index.js'],
    devtool: 'source-map',
    output : {
        path:__dirname,
        publicPath:"/",
        filename:"bundle.js"
    },
    module: {
      rules: [
        {
            test: /\.(js)/,
            exclude: /node_modules/,
            use: {
              loader: 'script-loader',
            }
          },
        {
          test: /\.css/,
          use: ['style-loader', 'css-loader']
        }
      ]
    }
  }