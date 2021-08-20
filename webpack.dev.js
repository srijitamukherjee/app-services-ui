const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const CopyPlugin = require('copy-webpack-plugin');
const { port, crc } = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || port;
const PROTOCOL = process.env.PROTOCOL || 'https';
const BETA = process.env.BETA || true;

const basePublicPath = `${BETA ? '/beta': ''}/apps`

const publicPath = `${basePublicPath}/${crc.bundle}/`;

module.exports = merge(common('development', {
  publicPath
}), {

  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    static: {
      publicPath,
      directory: "./dist",
    },
    host: HOST,
    port: PORT,
    compress: true,
    historyApiFallback: {
      index: `${publicPath}index.html`
    },
    hot: true,
    client: {
      overlay: true,
    },
    open: {
      target: [`https://prod.foo.redhat.com:1337${BETA ? '/beta': ''}/${crc.bundle}/`]
    },
    allowedHosts: "all",
    devMiddleware: {
      publicPath,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    proxy: {
      viewPath:
        {
          target: `${PROTOCOL}://${HOST}:${PORT}${publicPath}`,
          pathRewrite: { viewPathRewritePattern: '' },
          secure: false
        }
    }
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'config/config.json',
          to: `config.json`
        }
      ]
    })
  ]
});
