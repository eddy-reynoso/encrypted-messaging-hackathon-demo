const dotenv = require("dotenv");
dotenv.config();

const webpack = require("webpack");

const serverUrl = JSON.stringify(process.env.SERVER_URL);
const appID = JSON.stringify(process.env.APP_ID);

module.exports = {
  webpack: (config) => {
    const env = { SERVER_URL: serverUrl, APP_ID: appID };
    config.plugins.push(new webpack.DefinePlugin(env));

    // Add ESM support for .mjs files in webpack 4
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });

    return config;
  },
};
