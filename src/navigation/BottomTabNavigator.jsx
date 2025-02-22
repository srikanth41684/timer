import {View, Text} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';

const bottomTabNav = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <bottomTabNav.Navigator>
      <bottomTabNav.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <bottomTabNav.Screen
        name="History"
        component={HistoryScreen}
        options={{headerShown: false}}
      />
    </bottomTabNav.Navigator>
  );
};

export default BottomTabNavigator;
