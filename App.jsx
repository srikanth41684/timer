import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import GlobalStackNavigator from './src/navigation/GlobalStackNavigator';

const App = () => {
  return (
    <NavigationContainer>
      <GlobalStackNavigator />
    </NavigationContainer>
  );
};

export default App;
