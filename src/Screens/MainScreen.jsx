import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const mainScreen = () => {
  return (
    <View>
      <Text style={styles.title}>main</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginTop: 200,
    fontSize: 20,
  },
});

export default mainScreen;
