module.exports = function (api) {
  api.cache(true);
  // babel-preset-expo (SDK 57) adds react-native-worklets/plugin automatically.
  return { presets: ["babel-preset-expo"] };
};
