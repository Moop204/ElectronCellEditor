/* eslint-disable @typescript-eslint/no-var-requires */
const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins").default;

rules.push({
  test: /\.css$/,
  use: [{ loader: "style-loader" }, { loader: "css-loader" }],
});

rules.push({
  test: /\.pdf$/,
  use: [{ loader: "file-loader" }],
});

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".pdf"],
  },
};
