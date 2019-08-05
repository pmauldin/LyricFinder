const rules = require('./webpack.rules');

rules.push({
  test: /\.(js|jsx|ts|tsx)$/,
  exclude: /node_modules/,
  use: "babel-loader",
});


module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.js',
  // Put your normal webpack config below here
  module: {
    rules
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
  }
};
