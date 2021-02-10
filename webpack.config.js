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
              loader: 'babel-loader',
              options: {
                presets: ["@babel/preset-env"],
                plugins: [
                  [ "@babel/plugin-transform-runtime", {
                    "regenerator": true
                  }]
                ]
              }
            }
          },
        {
          test: /\.css/,
          use: ['style-loader', 'css-loader']
        }
      ]
    }
  }