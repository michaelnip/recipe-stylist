const webpack = require("webpack");
module.exports = {
  entry: "./scripts.js",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  plugins: [
    new webpack.EnvironmentPlugin({"RFN_KEY": process.env.RFN_KEY})
  ]
};
