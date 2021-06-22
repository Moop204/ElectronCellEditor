/* eslint-disable @typescript-eslint/no-var-requires */
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  new MiniCssExtractPlugin(),
  [
    "postcss-preset-env",
    {
      // Options
    },
  ],
];
