import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';

const GlobalStackNavigator = () => {
  const GlobalStack = createNativeStackNavigator();
  return (
    <GlobalStack.Navigator>
      <GlobalStack.Screen
        name="bottomTabNav"
        component={BottomTabNavigator}
        options={{headerShown: false}}
      />
    </GlobalStack.Navigator>
  );
};

export default GlobalStackNavigator;
