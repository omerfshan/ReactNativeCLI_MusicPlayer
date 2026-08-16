/**
 * @format
 */
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  return {
    GestureHandlerRootView: View,
  };
});

jest.mock('react-native-track-player', () => ({
  setupPlayer: jest.fn().mockResolvedValue(true),
  updateOptions: jest.fn().mockResolvedValue(true),
  addEventListener: jest.fn(),
  getPlaybackState: jest.fn().mockResolvedValue({ state: 'idle' }),
  getProgress: jest.fn().mockResolvedValue({ position: 0, duration: 0 }),
  useProgress: jest.fn().mockReturnValue({ position: 0, duration: 0 }),
  usePlaybackState: jest.fn().mockReturnValue({ state: 'idle' }),
  Capability: {},
  Event: {},
  State: { Playing: 'playing', Paused: 'paused', Buffering: 'buffering' },
  add: jest.fn(),
  reset: jest.fn(),
  play: jest.fn(),
  pause: jest.fn(),
  seekTo: jest.fn(),
  stop: jest.fn(),
}));

jest.mock('@dr.pogodin/react-native-fs', () => ({
  exists: jest.fn().mockResolvedValue(true),
  mkdir: jest.fn().mockResolvedValue(true),
  readDir: jest.fn().mockResolvedValue([]),
}), { virtual: true });

jest.mock('@missingcore/audio-metadata', () => ({
  getAudioMetadata: jest.fn().mockResolvedValue({ metadata: {} }),
}), { virtual: true });

jest.mock('react-native-sound', () => jest.fn(), { virtual: true });

jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');

jest.mock('../src/components/EqualizerAnimation', () => 'EqualizerAnimation');

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
