const webpack = require("webpack");
module.exports = {
  entry: "./scripts.js",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      "API_ID": process.env.API_ID,
      "API_KEY": process.env.API_KEY 
    })
  ]
};
