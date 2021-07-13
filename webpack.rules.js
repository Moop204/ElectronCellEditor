module.exports = [
  // Add support for native node modules
  {
    test: /\.node$/,
    use: "node-loader",
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: "@marshallofsound/webpack-asset-relocator-loader",
      options: {
        outputAssetBase: "native_modules",
      },
    },
  },
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: "ts-loader",
      options: {
        transpileOnly: true,
      },
    },
  },
  {
    test: /\.wasm$/,
    type: "asset/resource",
  },
  {
    test: /\.gif$/,
    type: "asset/resource",
  },
  {
    test: /\.png$/,
    type: "asset/resource",
  },
  {
    test: /test\.ts$/,
    use: "mocha-loader",
    exclude: /node_modules/,
  },
  {
    test: /\.pdf$/,
    type: "asset/resource",
  },
  {
    test: /\.svg$/,
    type: "asset/resource",
    use: ["@svgr/webpack"],
  },
];
