const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin  = require("mini-css-extract-plugin");
const HTML = require('html-webpack-plugin');
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const production = process.env.NODE_ENV === 'production';

const LOCAL_HOST = 'localhost';
const LOCAL_SERVER_PORT = 8090;

const out = path.resolve(__dirname, 'assets');
const jsPath = path.resolve(__dirname, 'src', 'js');
const htmlPath = path.resolve(__dirname, 'src', 'html');
const imgPath = path.resolve(__dirname, 'src', 'img');
const fontsPath = path.resolve(__dirname, 'src', 'fonts');
const vendorsPath = path.resolve(jsPath, 'vendors');

let config = {
  mode: process.env.NODE_ENV,
  entry: {
    app: ['./src/js/index.js', './src/styles/main.scss']
  },
  devtool: 'source-map',
  output: {
    path: out,
    filename: 'js/[name].bundle.js',
    sourceMapFilename: '[file].map',
    publicPath: '/'
  },
  resolve: {
    alias: {
      utils: path.resolve(__dirname, 'src', 'js', 'utils'),
      store: path.resolve(__dirname, 'src', 'js', 'store')
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: jsPath,
        exclude: vendorsPath,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.js$/,
        include: vendorsPath,
        use: {
          loader: 'file-loader',
          options: {
            name: 'js/vendors/[name].[ext]'
          }
        }
      },
      {
        test: /\.html$/,
        include: htmlPath,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        }
      },
      {
        test: /\.scss|css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.png$/,
        include: imgPath,
        use: {
          loader: 'url-loader',
          options: {
            limit: 15000,
            mimetype: 'image/png',
            name: 'img/[name].[ext]'
          }
        }
      },
      {
        test: /\.jpg$/,
        include: imgPath,
        use: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]'
          }
        }
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2)$/,
        include: fontsPath,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'fonts/[name].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    new HTML({
      template: './src/html/index.html.ejs',
      filename: 'index.html',
      inject: false,
      minJS: production ? '.min' : '',
      APPVERSION: new Date().toDateString(),
      hash: true
    }),

    // build css into separate file
    new MiniCssExtractPlugin({
      filename: "style/[name].css",
      chunkFilename: "style/[id].css"
    }),

    // postcss config
    new webpack.LoaderOptionsPlugin({
      cache: true,
      options: {
        postcss: [
          require('autoprefixer')({
            browsers: ['last 3 version']
          })
        ]
      }
    }),

    new webpack.DefinePlugin({
      __DEV__: process.env.NODE_ENV !== 'production',
      __PRODUCTION__: process.env.NODE_ENV === 'production',
      __TEST__: JSON.stringify(process.env.TEST || false),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    // new BundleAnalyzerPlugin()
  ],
  devServer: {
    contentBase: path.resolve(__dirname, "assets"),
    publicPath: "/",
    port: LOCAL_SERVER_PORT,
    historyApiFallback: true,
    hot: false,
    inline: false,
    host: '0.0.0.0'
  }
};

module.exports = config;