module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-gesture-handler|react-native-reanimated|react-native-safe-area-context|@gorhom/bottom-sheet|@react-native-community)/)',
  ],
};
