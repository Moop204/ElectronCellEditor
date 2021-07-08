/* eslint-disable @typescript-eslint/no-var-requires */
const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins").default;
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

rules.push({
  test: /\.css$/i,
  use: ["style-loader", "css-loader"],
});

module.exports = {
  plugins: [new ForkTsCheckerWebpackPlugin(), new MiniCssExtractPlugin()],
  module: {
    rules,
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".pdf"],
  },
};
