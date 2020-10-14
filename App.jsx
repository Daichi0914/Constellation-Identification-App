import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { StyleSheet, Text, View } from 'react-native';

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

export default () => <App />;

const styles = StyleSheet.create({});
