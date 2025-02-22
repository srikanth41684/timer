import {View, Text} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';

const bottomTabNav = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <bottomTabNav.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'History') {
            iconName = 'history';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
        },
        tabBarStyle: {
          backgroundColor: '#ffffff',
          height: 60,
        },
      })}>
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
