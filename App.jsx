import React from 'react';
import { RecoilRoot } from 'recoil';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { StyleSheet } from 'react-native';

import mainScreen from './src/Screens/MainScreen';
import cameraRollScreen from './src/Screens/CameraRollScreen';
import ArScreen from './src/Screens/ArScreen';

const TabNavigator = createBottomTabNavigator(
  {
    Ar: ArScreen,
    Main: mainScreen,
    Camera: cameraRollScreen,
  },
  {
    initialRouteName: 'Main',
  }
);

const App = createAppContainer(TabNavigator);

export default () => (
  <RecoilRoot>
    <App />
  </RecoilRoot>
);

const styles = StyleSheet.create({});
