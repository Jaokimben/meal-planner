const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Fix for Windows path issues
  config.resolve.modules = [
    ...(config.resolve.modules || []),
    path.resolve(__dirname, './node_modules'),
    path.resolve(__dirname, '.'),
  ];

  return config;
};