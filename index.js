import './global.css';
import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import TrackPlayer from 'react-native-track-player';
import App from './App';
import { name as appName } from './app.json';
import { PlaybackService } from './src/services/trackPlayerService';

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => PlaybackService);
